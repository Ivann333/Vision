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
import { JwtGuard } from 'src/auth/guard';
import { TimeEntryService } from './time-entry.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { FindAllTimeEntriesQueryDto } from './dto/find-all-time-entries-query.dto';

@Controller('time-entries')
export class TimeEntryController {
  constructor(private timeEntryService: TimeEntryService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(
    @GetUser() user: User,
    @Body() createTimeEntryDto: CreateTimeEntryDto,
  ) {
    return this.timeEntryService.create(user, createTimeEntryDto);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@GetUser() user: User, @Query() query: FindAllTimeEntriesQueryDto) {
    return this.timeEntryService.findAll(user, query);
  }


  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
  ) {
    return this.timeEntryService.update(user, id, updateTimeEntryDto);
  }

}
