import { ExternalProduct } from './external-product.interface';

export interface ExternalProductResponse {
  success: boolean;
  page: number;
  lastPage: number;
  data: Array<ExternalProduct>;
}
