export interface PaginatedCategories {
  items: Array<string>;
  total: number;
  limit: number;
  page: number;
  nextPage: number | null;
}
