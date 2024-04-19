import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MaterialuserService } from './materialuser.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('materialEnrollment')
@ApiTags('User enrollment to course materials')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class MaterialuserController {
  constructor(private materialUserService: MaterialuserService) {}

  /**
   * This method will enroll one user to one course-material only once.
   */
  // @Post('register/:courseMaterialTitle/:email')
  // @UseGuards(RolesGuard)  
  // @Permissions('allCourses', 'view')
  // registerComment(
  //   @Param('courseMaterialTitle') courseMaterialTitle: string,
  //   @Param('email') email: string,
  // ): Promise<Object> {
  //   return this.materialUserService.register(courseMaterialTitle, email);
  // }
  /**
   * register newly done with out register, material.
   */
  @Post('doneWithoutRegister/:courseMaterialId/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  doneWithoutRegister(
    @Param('courseMaterialId') courseMaterialId: string,
    @Param('email') email: string,
  ): Promise<Object> {
    return this.materialUserService.doneWithoutRegister(courseMaterialId, email);
  }

  // find all user enrollment to materials under specific course.
  @Get('findManyByCourseUser/:courseTitle/:email')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findManyByCourseUser(@Param('courseTitle') courseTitle: string, @Param('email') email: string): Promise<Object> {
    return this.materialUserService.findManyByCourseUser(courseTitle, email);
  }

  /**
   * updateOne method will change status of the user for the one material,
   * from PROGRESS to COMPLETED and it will set the completion time.
   */
  @Patch('changeStatus/:courseMaterialEnrollmentId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  updateOneById(@Param('courseMaterialEnrollmentId') courseMaterialEnrollmentId: string): Promise<Object> {
    return this.materialUserService.updateOneById(courseMaterialEnrollmentId);
  }

  // delete one by id.
  @Delete('deleteOneById/:enrollmentId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  deleteOne(@Param('enrollmentId') enrollmentId: string): Promise<Object> {
    return this.materialUserService.deleteOneById(enrollmentId);
  }
}
