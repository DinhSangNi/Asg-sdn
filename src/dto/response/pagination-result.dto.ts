import { Product } from 'src/entity/product.schema';

export class PaginationResultDto<T> {
  data: T[];
  total: number;
  totalPages: number;
  hasMore: boolean;
}
