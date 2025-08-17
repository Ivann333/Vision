import { IsOptional, Min, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseFindAllQueryDto {
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

  @IsOptional()
  @IsString()
  fields?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}
