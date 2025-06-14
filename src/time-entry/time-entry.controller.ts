import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { TimeEntryService } from './time-entry.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { FindAllTimeEntriesQueryDto } from './dto/find-all-time-entries-query.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@UseGuards(JwtGuard)
@Controller('time-entries')
export class TimeEntryController {
  constructor(private timeEntryService: TimeEntryService) {}

  @Post()
  create(
    @GetUser() user: User,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ) {
    return this.timeEntryService.create(user, createTimeEntryDto);
  }

  @Get()
  findAll(@GetUser() user: User, @Query() query: FindAllTimeEntriesQueryDto) {
    return this.timeEntryService.findAll(user, query);
  }

  @Get(':id')
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.timeEntryService.findOne(user, id);
  }

  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.update(user, id, updateTimeEntryDto);
  }

  @Delete(':id')
  remove(@GetUser() user: User, @Param('id') id: string) {
    return this.timeEntryService.remove(user, id);
  }
}
