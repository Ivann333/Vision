import { IsOptional, IsString } from 'class-validator';

export class SelectFieldsQueryDto {
  @IsOptional()
  @IsString()
  fields?: string;
}
