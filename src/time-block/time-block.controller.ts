import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { CreateTimeBlockDto } from './dto/create-time-block.dto';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';
import { FindAllTimeBlocksQueryDto } from './dto/find-all-time-blocks-query.dto';
import { UpdateTimeBlockDto } from './dto/update-time-block.dto';

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
  findAll(@GetUser() user: User, @Query() query: FindAllTimeBlocksQueryDto) {
    return this.timeBlockService.findAll(user, query);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.timeBlockService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateTimeBlockDto: UpdateTimeBlockDto,
  ) {
    return this.timeBlockService.update(user, id, updateTimeBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeBlockService.remove(+id);
  }
}
