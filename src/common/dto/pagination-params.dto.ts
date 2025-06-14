import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationParams {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;
}
