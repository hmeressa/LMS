import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MostsearchedcoursesService } from './mostsearchedcourses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator'; 

@Controller('recentlyAccessedCourse')
@ApiTags('Recently accessed courses')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class MostsearchedcoursesController {
  constructor(private mostSearchedCoursesService: MostsearchedcoursesService) {}
  // search register.
  @Post('register/:courseId/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  register(@Param('courseId') courseId: string, @Param('email') email: string): Promise<Object> {
    return this.mostSearchedCoursesService.register(courseId, email);
  }

  /**
   * Find all history throughout the system.
   * This may help us at admin side for further analysis.
   */
  @Get('findAll')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view') // a user who can view all courses can view all most searched courses.
  findAll(): Promise<Object> {
    return this.mostSearchedCoursesService.findAll();
  }

  // find all history associated with given email.
  @Get('findManyByEmail/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findManyById(@Param('email') email: string): Promise<Object> {
    return this.mostSearchedCoursesService.findManyByEmail(email);
  }

  // delete one by id.
  @Delete('deleteOneById/:accessId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  deleteOne(@Param('accessId') accessId: string): Promise<Object> {
    return this.mostSearchedCoursesService.deleteOneById(accessId);
  }

  // clear all history for specific user.
  @Delete('deleteManyByEmail/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  deleteAll(@Param('email') email: string) {
    return this.mostSearchedCoursesService.deleteAllByEmail(email);
  }
}
