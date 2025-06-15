import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

import { PaginatedProducts } from './interfaces/paginated-products.interface';
import { ExternalProduct } from './interfaces/external-product.interface';
import { ExternalProductResponse } from './interfaces/external-product-response.interface';

import { Product } from '../database/models/product.model';
import { PaginationParams } from '../common/dto/pagination-params.dto';
import { EVENTS } from '../common/constants';

@Injectable()
export class ProductsService {
  private syncInProgress: boolean = false;
  private inMemoryProductsRepository: Array<Product> = [];
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product)
    private readonly productsRepository: typeof Product,
    private readonly httpService: HttpService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Cron('0 0,12 * * *')
  async startDbSync() {
    if (this.syncInProgress) {
      throw new BadRequestException('Sync already in progress.');
    }

    this.syncInProgress = true;

    try {
      for (let page = 1; ; page++) {
        const { productsToUpsert, moreProducts } =
          await this.getProductPage(page);
        await this.upsertProducts(productsToUpsert);

        if (!moreProducts) {
          break;
        }
      }
    } finally {
      this.inMemoryProductsRepository = await this.productsRepository.findAll();
      this.syncInProgress = false;
      this.eventEmitter.emit(EVENTS.DB.SYNCED);
    }
  }

  private async getProductPage(page: number) {
    const { data } = await firstValueFrom(
      this.httpService
        .get<ExternalProductResponse>(
          'https://demoshopapi.keydev.eu/api/v1/products',
          {
            params: {
              limit: 100,
              page,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            this.syncInProgress = false;
            throw new BadRequestException(error);
          }),
        ),
    );

    return {
      productsToUpsert: data.data.map(this.mapExternalProductToProduct),
      moreProducts: !(page === data.lastPage),
    };
  }

  private async upsertProducts(products: Array<Record<any, string | number>>) {
    const transaction = await this.productsRepository.sequelize.transaction();
    try {
      await this.productsRepository.bulkCreate(products, {
        updateOnDuplicate: [
          'imgPath',
          'productType',
          'displayName',
          'department',
          'stock',
          'color',
          'price',
          'material',
          'ratings',
          'sales',
        ],
        transaction,
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      this.logger.error(err);
      throw new Error('Something went wrong.');
    }
  }

  findAll(paginationParams: PaginationParams): PaginatedProducts {
    const { limit = 10, page = 1 } = paginationParams;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    const items = this.inMemoryProductsRepository.slice(startIndex, endIndex);

    return {
      items,
      total: this.inMemoryProductsRepository.length,
      limit,
      page,
      nextPage:
        this.inMemoryProductsRepository.length > page * limit ? page + 1 : null,
    };
  }

  private mapExternalProductToProduct = (externalProduct: ExternalProduct) => ({
    imgPath: externalProduct.product_image_md,
    id: externalProduct._id,
    productType: externalProduct.product_type,
    displayName: externalProduct.product_name,
    department: externalProduct.product_department,
    stock: externalProduct.product_stock,
    color: externalProduct.product_color,
    price: externalProduct.product_price,
    material: externalProduct.product_material,
    ratings: externalProduct.product_ratings,
    sales: externalProduct.product_sales,
  });
}
