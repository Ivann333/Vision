import { ConfigService } from '@nestjs/config';

export const mongooseConfigFactory = (configService: ConfigService) => {
  const dbUrl = configService.get<string>('DB_URL');
  const dbPassword = configService.get<string>('DB_PASSWORD');
  const dbUri = dbUrl!.replace('<db_password>', dbPassword!);

  return { uri: dbUri };
};
