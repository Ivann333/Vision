import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TimeBlockService } from './time-block.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('time-blocks')
export class TimeBlockController {
  constructor(private readonly timeBlockService: TimeBlockService) {}

  @Post()
  create() {
    return this.timeBlockService.create();
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
