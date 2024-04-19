import { Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import { CourseModule } from './course/course.module';
import { CoursematerialModule } from './coursematerial/coursematerial.module'; 
import { MostsearchedcoursesModule } from './mostsearchedcourses/mostsearchedcourses.module';
import { CommentsModule } from './comments/comments.module';
import { CourseuserModule } from './courseuser/courseuser.module';
import { MaterialuserModule } from './materialuser/materialuser.module';

@Module({
  imports: [
    CategoryModule,
    CourseModule,
    CoursematerialModule, 
    MostsearchedcoursesModule,
    CommentsModule,
    CourseuserModule,
    MaterialuserModule,
  ],
})
export class CoursesModule {}
