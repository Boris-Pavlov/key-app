import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ProductsModule,
    CategoriesModule,
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      storage:
        'C:\\Users\\FactualInsanity\\Documents\\GitHub Projects\\key-app\\src\\database\\products.sqlite3',
      autoLoadModels: true,
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
