import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CourseService } from '../course/course.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CourseService]
})
export class CategoryModule {}
