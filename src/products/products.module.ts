import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Product } from '../database/models/product.model';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [SequelizeModule.forFeature([Product]), HttpModule],
})
export class ProductsModule {}
