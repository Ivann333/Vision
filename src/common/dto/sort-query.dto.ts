import { IsOptional, IsString } from 'class-validator';

export class SortQueryDto {
  @IsOptional()
  @IsString()
  sort?: string;
}
