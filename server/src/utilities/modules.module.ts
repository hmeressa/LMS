import { Module } from '@nestjs/common';
import { UsersModule } from './usersmgt/users.module';
import { CoursesModule } from './courses/courses.module';
import { TeamsModule } from './usersmgt/teams/teams.module';

@Module({
  imports: [
    UsersModule, 
    CoursesModule, 
    TeamsModule
  ],
})
export class ModulesModule {}
