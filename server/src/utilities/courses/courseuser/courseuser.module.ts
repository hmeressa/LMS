import { Module } from '@nestjs/common';
import { CourseuserController } from './courseuser.controller';
import { CourseUserService } from './courseuser.service';

@Module({
  controllers: [CourseuserController],
  providers: [CourseUserService]
})
export class CourseuserModule {}
