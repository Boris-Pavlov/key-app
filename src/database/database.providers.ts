import { Sequelize } from 'sequelize-typescript';
import { Product } from '../products/product.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: () => {
      const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'products.sqlite3',
      });
      sequelize.addModels([Product]);

      return sequelize;
    },
  },
];
