import { Product } from '../../database/models/product.model';

export interface PaginatedProducts {
  items: Array<Product>;
  total: number;
  limit: number;
  page: number;
  nextPage: number | null;
}
