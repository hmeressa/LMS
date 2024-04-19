import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { Course, CourseUpdate } from '../../../utilities/courseDto';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('course')
@ApiTags('course')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class CourseController {
  constructor(private courseService: CourseService) {}

  // register courses
  @Post('register')
  @UseGuards(RolesGuard)
  @Permissions('allCourses', 'add')
  registerCourse(@Body() course: Course) {
    return this.courseService.register(course);
  }

  // get all courses.
  @Get('findAll')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findAll(): Promise<Object> {
    return this.courseService.findAll();
  }
  
  // get by id
  @Get('findOneById/:courseId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findOneById(@Param('courseId') courseId: string) {
    return this.courseService.findOneById(courseId);
  }
  
  // get one by its name
  @Get('findOneByName/:title') 
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findOneByName(@Param('title') title: string) {
    return this.courseService.findOneByName(title);
  }

  // update course Info
  @Put('updateOneById/:courseId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'edit')
  updateOneById(@Param('courseId') courseId: string, @Body() course: CourseUpdate): Promise<Object> {
    return this.courseService.updateOne(courseId, course);
  }
  
  // get all courses progress.
  @Get('getCourseProgress')
  @UseGuards(RolesGuard)  
  @Permissions('dashboard', 'view')
  getCourseProgress(): Promise<Object> {
    return this.courseService. getCourseProgress();
  }
  
  // delete one course by its title. if they are not referenced
  @Delete('DeleteByTitle/:title')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'delete')
  deleteByTitle(@Param('title') title: string) {
    return this.courseService.deleteOneByTitle(title);
  }

  // delete all courses, if they are not referenced.
  @Delete('deleteAll')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'delete')
  deleteAll() {
    return this.courseService.deleteAll();
  }
}
