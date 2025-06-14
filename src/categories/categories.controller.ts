import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { PaginatedCategories } from './interfaces/paginated-categories.interface';

import { PaginationParams } from '../common/dto/pagination-params.dto';

@Controller('categories')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(
    @Query() paginationParams: PaginationParams,
  ): Promise<PaginatedCategories> {
    return this.categoriesService.findAll(paginationParams);
  }
}
