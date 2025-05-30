import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @IsNumber()
  limit?: number;
}
