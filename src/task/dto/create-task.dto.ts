import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { TaskType } from '../enums/task-type.enum';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(TaskType)
  type: TaskType;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsNumber()
  estimation?: number;
}
