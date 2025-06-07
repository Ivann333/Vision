import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { TaskType } from '../enums/task-type.enum';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsNumber()
  estimation?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: TransformFnParams): TransformFnParams | boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isCompleted?: boolean;
}
