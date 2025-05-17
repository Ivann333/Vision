import { IsBoolean, IsString } from 'class-validator';

export class TaskDto {
  @IsString()
  name: string;

  @IsBoolean()
  isMain: boolean;

  estimation?: number;
}
