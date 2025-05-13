import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor() {}

  onModuleInit() {
    console.log('MongoDB connected✅');
  }
}
