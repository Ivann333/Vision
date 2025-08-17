import { Type, Transform, TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskType } from 'src/task/enums/task-type.enum';

export class DateFilterDto {
  @IsOptional()
  @IsDate({ message: 'gte must be a valid ISO 8601 date string' })
  @Type(() => Date)
  gte?: Date;

  @IsOptional()
  @IsDate({ message: 'lte must be a valid ISO 8601 date string' })
  @Type(() => Date)
  lte?: Date;

  @IsOptional()
  @IsDate({ message: 'gt must be a valid ISO 8601 date string' })
  @Type(() => Date)
  gt?: Date;

  @IsOptional()
  @IsDate({ message: 'lt must be a valid ISO 8601 date string' })
  @Type(() => Date)
  lt?: Date;

  @IsOptional()
  @IsDate({ message: 'eq must be a valid ISO 8601 date string' })
  @Type(() => Date)
  eq?: Date;

  @IsOptional()
  @IsDate({ message: 'ne must be a valid ISO 8601 date string' })
  @Type(() => Date)
  ne?: Date;
}

export class NumberFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gte?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lte?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  gt?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lt?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  eq?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ne?: number;
}

export class StringFilterDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  eq?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  ne?: string;
}

export class BooleanFilterDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: TransformFnParams): TransformFnParams | boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  eq?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }: TransformFnParams): TransformFnParams | boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  ne?: boolean;
}

export class TaskTypeFilterDto {
  @IsOptional()
  @IsEnum(TaskType)
  eq?: TaskType;

  @IsOptional()
  @IsEnum(TaskType)
  ne?: TaskType;
}
