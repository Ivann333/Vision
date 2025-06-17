import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';

@UseGuards(JwtGuard)
@Controller('time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body() createTimeBlockDto: CreateTimeBlockDto,
  ) {
    return this.timeBlockService.create(user, createTimeBlockDto);
  }

  @Get()
  findAll() {
    return this.timeBlockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeBlockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.timeBlockService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeBlockService.remove(+id);
  }
}
