import { Module } from '@nestjs/common';
import { MostsearchedcoursesController } from './mostsearchedcourses.controller';
import { MostsearchedcoursesService } from './mostsearchedcourses.service';

@Module({
  controllers: [MostsearchedcoursesController],
  providers: [MostsearchedcoursesService]
})
export class MostsearchedcoursesModule {}
