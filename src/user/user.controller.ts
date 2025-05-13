import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor() {}

  @Get()
  getUser() {
    return 'Hello world';
  }
}
