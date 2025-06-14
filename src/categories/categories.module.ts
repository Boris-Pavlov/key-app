import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { Product } from '../database/models/product.model';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [SequelizeModule.forFeature([Product])],
})
export class CategoriesModule {}
