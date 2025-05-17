import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { TaskDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.schema';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskSevice: TaskService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: User, @Body() taskDto: TaskDto) {
    return this.taskSevice.create(user, taskDto);
  }
}
