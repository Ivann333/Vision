import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskSevice: TaskService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: User, @Body() createTaskDto: CreateTaskDto) {
    return this.taskSevice.create(user, createTaskDto);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskSevice.update(user, id, updateTaskDto);
  }
}
