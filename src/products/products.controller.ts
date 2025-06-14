import {
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { PaginatedProducts } from './interfaces/paginated-products.interface';
import { ProductsService } from './products.service';

import { PaginationParams } from '../common/dto/pagination-params.dto';

@Controller('products')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
export class ProductsController {
  constructor(private producstsService: ProductsService) {}

  @Post()
  async populateDB() {
    return this.producstsService.startDbSync();
  }

  @Get()
  async findAll(
    @Query() paginationParams: PaginationParams,
  ): Promise<PaginatedProducts> {
    return this.producstsService.findAll(paginationParams);
  }
}
