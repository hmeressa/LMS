import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../email/email.service'; 
import { SeederService } from './seeder.service';

@Module({
  imports: [
    ConfigModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [SeederService, EmailService],
})
export class SeederModule {}