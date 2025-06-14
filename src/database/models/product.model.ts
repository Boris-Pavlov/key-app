import {
  Column,
  Model,
  Table,
  DataType,
  PrimaryKey,
  Unique,
  AllowNull,
  Min,
  Max,
} from 'sequelize-typescript';

@Table({
  timestamps: true,
})
export class Product extends Model {
  @PrimaryKey
  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(32))
  id: string = undefined;

  @Column(DataType.STRING(64))
  imgPath: string;

  @Column(DataType.STRING(32))
  productType: string;

  @Column(DataType.STRING(64))
  displayName: string;

  @Column(DataType.STRING(32))
  department: string;

  @Min(0)
  @Column(DataType.INTEGER)
  stock: number;

  @Column(DataType.STRING(16))
  color: string;

  @Min(0)
  @Column(DataType.FLOAT)
  price: number;

  @Column(DataType.STRING(16))
  material: string;

  @Min(0)
  @Max(5)
  @Column(DataType.INTEGER)
  ratings: number;

  @Min(0)
  @Column(DataType.INTEGER)
  sales: number;
}
