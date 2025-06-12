import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Product extends Model {
  @Column(DataType.STRING(32))
  @PrimaryKey
  @Unique
  @AllowNull(false)
  id: string = undefined;

  @Column(DataType.STRING(64))
  imgPath: string;

  @Column(DataType.STRING(32))
  productType: string;

  @Column(DataType.STRING(64))
  displayName: string;

  @Column(DataType.STRING(32))
  department: string;

  @Column(DataType.INTEGER)
  stock: number;

  @Column(DataType.STRING(16))
  color: string;

  @Column(DataType.INTEGER)
  price: number;

  @Column(DataType.STRING(16))
  material: string;

  @Column(DataType.INTEGER)
  ratings: number;

  @Column(DataType.INTEGER)
  sales: number;
}
