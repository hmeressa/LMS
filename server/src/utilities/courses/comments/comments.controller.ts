import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { Comment } from '../../courseDto';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('comments')
@ApiTags('comments')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  // register a course with given course title and email.
  @Post('register/:courseTitle/:email')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'add')
  registerComment(
    @Param('courseTitle') courseTitle: string,
    @Param('email') email: string,
    @Body() comment: Comment,
  ): Promise<Object> {
    return this.commentsService.registerComment(courseTitle, email, comment);
  }

  // find all comments under specific courses.
  @Get('findManyByCourse/:courseTitle')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'view')
  findManyByCourse(@Param('courseTitle') title: string): Promise<Object> {
    return this.commentsService.findManyByCourse(title);
  }

  @Post('createReadHistory/:commentId/:email')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'view')
  createReadHistory(@Param('commentId') commentId: string, @Param('email') email: string): Promise<Object> {
    return this.commentsService.createReadHistory(commentId, email);
  }

  @Get('usersRead/:commentId')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'view')
  usersReadOne(@Param('commentId') commentId: string) {
    return this.commentsService.usersReadOne(commentId);
  }

  // update one comment by its id.
  @Put('updateOne/:commentId')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'edit')
  updateOne(@Param('commentId') commentId: string, @Body() comment: Comment): Promise<Object> {
    return this.commentsService.updateOne(commentId, comment);
  }

  // delete registered comment by id.
  @Delete('deleteOne/:commentId')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'delete')
  deleteOne(@Param('commentId') commentId: string): Promise<Object> {
    return this.commentsService.deleteOne(commentId);
  }
  // delete registered comment by course name.
  @Delete('deleteManyByCourseTitle/:courseTitle')
  @UseGuards(RolesGuard)
  @Permissions('comment', 'delete')
  deleteManyByCourseTitle(@Param('courseTitle') courseTitle: string): Promise<Object> {
    return this.commentsService.deleteManyByCourseTitle(courseTitle);
  }
}
