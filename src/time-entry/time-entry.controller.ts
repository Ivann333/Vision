import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { TimeEntryService } from './time-entry.service';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/user/user.schema';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';

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
}
