import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OnEvent } from '@nestjs/event-emitter';

import { PaginatedCategories } from './interfaces/paginated-categories.interface';

import { Product } from '../database/models/product.model';
import { PaginationParams } from '../common/dto/pagination-params.dto';
import { EVENTS } from '../common/constants';

@Injectable()
export class CategoriesService {
  private inMemoryCategoriesRepository: Array<string> = [];

  constructor(
    @InjectModel(Product)
    private productsRepository: typeof Product,
  ) {}

  @OnEvent(EVENTS.DB.SYNCED)
  async handleDbSyncEvent() {
    const products = await this.productsRepository.findAll({
      attributes: ['department'],
      group: 'department',
    });

    this.inMemoryCategoriesRepository = products.map((product) =>
      product.get('department'),
    );
  }

  findAll(paginationParams: PaginationParams): PaginatedCategories {
    const { limit = 10, page = 1 } = paginationParams;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    const items = this.inMemoryCategoriesRepository.slice(startIndex, endIndex);

    return {
      items,
      total: this.inMemoryCategoriesRepository.length,
      limit,
      page,
      nextPage:
        this.inMemoryCategoriesRepository.length > page * limit
          ? page + 1
          : null,
    };
  }
}
