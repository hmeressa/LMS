import { Module } from '@nestjs/common';
import { CoursematerialController } from './coursematerial.controller';
import { CoursematerialService } from './coursematerial.service';

@Module({
  controllers: [CoursematerialController],
  providers: [CoursematerialService],
})
export class CoursematerialModule {}
