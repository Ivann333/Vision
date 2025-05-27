import { IsString } from 'class-validator';

export class TimeEntryDto {
  @IsString()
  taskName: string;
}
