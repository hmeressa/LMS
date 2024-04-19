import { Module } from '@nestjs/common';
import { MaterialuserController } from './materialuser.controller';
import { MaterialuserService } from './materialuser.service';
import { CourseUserService } from '../courseuser/courseuser.service';

@Module({
  controllers: [MaterialuserController],
  providers: [MaterialuserService, CourseUserService],
})
export class MaterialuserModule {}
