import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CourseUserService } from './courseuser.service';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('courseEnrollment')
@ApiTags('Course enrollment')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class CourseuserController {
  constructor(private courseUserService: CourseUserService) {}
  
  // enrollment register.
  @Post('register/:courseTitle/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  register(@Param('courseTitle') courseTitle: string, @Param('email') email: string): Promise<Object> {
    return this.courseUserService.register(courseTitle, email);
  }

  /**
   * Find all users to course enrollment.
   * This will help us at admin side.
   */
  @Get('findAll')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findAll(): Promise<Object> {
    return this.courseUserService.findAll();
  }

  /**
   * Find all completed enrollments throughout the system.
   * This will help us at admin side.
   */
  @Get('findAllDone')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  async findAllDone() { 
    return this.courseUserService.findAllDone();
}

/**
* Find all in progress enrollments throughout the system.
* This will help us at admin side.
*/
@Get('findAllProgress')
@UseGuards(RolesGuard)  
@Permissions('allCourses', 'view')
async findAllProgress() {
  return this.courseUserService.findAllProgress();
}

/**
* Find all completed enrollments throughout the system.
* This will help us at admin side.
*/
// @Get('findAllStarted')
// @UseGuards(RolesGuard)  
// @Permissions('allCourses', 'view')
// async findAllStarted() {
//   return this.courseUserService.findAllStarted();
// }

/**
* Find all completed enrollments throughout the system.
* This will help us at admin side.
*/
@Get('findAllForTeam/:teamName')
@UseGuards(RolesGuard)  
@Permissions('allCourses', 'view')
async findAllForTeam(@Param('teamName') teamName: string) {
  return this.courseUserService.findAllForTeam(teamName);
}

/**
* Find all completed enrollments throughout the system.
* This will help us at manager side.
*/
@Get('findAllDoneForTeam/:teamName')
@UseGuards(RolesGuard)  
@Permissions('allCourses', 'view')
async findAllDoneForTeam(@Param('teamName') teamName: string) {
  return this.courseUserService.findAllDoneForTeam(teamName);
}

/**
* Find all in progress enrollments throughout the system.
* This will help us at manager side.
*/
@Get('findAllProgressForTeam/:teamName')
@UseGuards(RolesGuard)  
@Permissions('allCourses', 'view')
async findAllProgressForTeam(@Param('teamName') teamName: string) {
  return this.courseUserService.findAllProgressForTeam(teamName);
}

/**
* Find all completed enrollments throughout the system.
* This will help us at manager side.
*/
// @Get('findAllStartedForTeam/:teamName')
// @UseGuards(RolesGuard)  
// @Permissions('allCourses', 'view')
// async findAllStartedForTeam(@Param('teamName') teamName: string) {
//   return this.courseUserService.findAllStartedForTeam(teamName);
// }


  // find all enrollments for specific user.
  @Get('findManyByEmail/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findManyById(@Param('email') email: string): Promise<Object> {
    return this.courseUserService.findManyByEmail(email);
  }

  // delete one by id.
  @Delete('deleteOneById/:enrollmentId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'delete')
  deleteOne(@Param('enrollmentId') enrollmentId: string): Promise<Object> {
    return this.courseUserService.deleteOneById(enrollmentId);
  }

  // clear all enrollment for specific user.
  @Delete('deleteManyByEmail/:email')
  @UseGuards(RolesGuard)
  @Permissions('allCourses', 'delete')
  deleteManyByEmail(@Param('email') email: string) {
    return this.courseUserService.deleteManyByEmail(email);
  }
}
