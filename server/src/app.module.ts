import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';  
import { ModulesModule } from './utilities/modules.module'; 
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { AuthModule } from './auth/auth.module';
import { MyConfigModule } from './config/config.module';  
import { SeederModule } from './seeder/seeder.module';
import { AppController } from './app.controller';  

@Module({
  imports: [
    MyConfigModule, 
    ModulesModule,
    PrismaModule,
    EmailModule,
    AuthModule,
    SeederModule
  ],  
  controllers: [AppController], 
})

export class AppModule {} 