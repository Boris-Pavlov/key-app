import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { PaginatedCategories } from './interfaces/paginated-categories.interface';

import { Product } from '../database/models/product.model';
import { PaginationParams } from '../common/dto/pagination-params.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Product)
    private productsRepository: typeof Product,
  ) {}

  async findAll(
    paginationParams: PaginationParams,
  ): Promise<PaginatedCategories> {
    const { limit = 10, page = 1 } = paginationParams;

    const { count, rows } = await this.productsRepository.findAndCountAll({
      attributes: ['department'],
      limit,
      offset: (page - 1) * limit,
      group: 'department',
    });

    return {
      items: rows.map((row) => row.get('department')),
      total: count.length,
      limit,
      page,
      nextPage: count.length > page * limit ? page + 1 : null,
    };
  }
}
