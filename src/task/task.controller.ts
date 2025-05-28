import { CreateTaskDto } from './dto';
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
  }
}
