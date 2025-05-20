import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { TimeEntryService } from './timeEntry.service';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.schema';
import { TimeEntryDto } from './dto';

@Controller('time-entries')
export class TimeEntryController {
  constructor(private timeEntryService: TimeEntryService) {}

  @UseGuards(JwtGuard)
  @Post('start')
  startEntry(@Body() dto: TimeEntryDto, @GetUser() user: User) {
    return this.timeEntryService.startEntry(user, dto);
  }

  @UseGuards(JwtGuard)
  @Post('stop')
  stopEntry(@GetUser() user: User) {
    return this.timeEntryService.stopEntry(user);
  }
}
