import { Module } from '@nestjs/common';
import { ProfileimgController } from './avatar.controller';
import { ProfileImageService } from './avatar.service';

@Module({
  controllers: [ProfileimgController],
  providers: [ProfileImageService],
})
export class ProfileimgModule {}
