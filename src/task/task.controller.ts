import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';
import { TaskService } from './task.service';
import { FindAllTasksQueryDto } from './dto/find-all-tasks-query.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskSevice: TaskService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@GetUser() user: User, @Body() createTaskDto: CreateTaskDto) {
    return this.taskSevice.create(user, createTaskDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@GetUser() user: User, @Query() query: FindAllTasksQueryDto) {
    return this.taskSevice.findAll(user, query);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.taskSevice.findOne(user, id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskSevice.update(user, id, updateTaskDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.taskSevice.remove(user, id);
  }
}
