import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../../courseDto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CommentsService {
  // constructor for prisma.
  constructor(private database: PrismaService) {}

  /**
   * Register comment method.
   */

  async registerComment(courseTitle: string, email: string, comment: Comment): Promise<Object> {
    // check if course title is not given.
    if (!courseTitle) {
      throw new NotAcceptableException('Course title is missed.');
    }
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }

    // check for the given course title.
    const course = await this.database.course.findUnique({
      where: { title: courseTitle },
    });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    // check for the user email validity
    const users = await this.database.users.findUnique({
      where: { email },
    });
    if (!users) {
      throw new NotFoundException('User not found');
    }

    // create new comment.
    await this.database.comment.create({
      data: {
        body: comment.body,
        courseId: course.id,
        userId: users.id,
      },
    });

    return { message: 'You have commented successfully.' };
  }

  /**
   * find all comments under specific course.
   */
  async findManyByCourse(title: string): Promise<Object> {
    // check if title of a course is not provided.
    if (!title) {
      throw new NotAcceptableException('Title of a course missed.');
    }

    // check wether the given course title is valid or not?
    const crs = await this.database.course.findUnique({
      where: { title },
    });

    // if not found.
    if (!crs) {
      throw new NotFoundException('Course Not found');
    }

    // read comment and include typer of the comment
    const comment = await this.database.comment.findMany({
      where: { courseId: crs.id },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true, 
          },
        },
      },
    });
    return comment;
  }


  // update one comment by its id. while user reads the comment.
  async createReadHistory(commentId: string, email: string) {
    // if comment id is missed.
    if (!commentId) {
      throw new NotAcceptableException('comment id is required.');
    }

    // if user email is missed.
    if (!email) {
      throw new NotAcceptableException('user email is required.');
    }

    // find the comment by the given id.
    const comment = await this.database.comment.findUnique({
      where: { id: commentId },
    });

    // if not found.
    if (!comment) {
      throw new NotFoundException('comment not found.');
    }

    // find the user by the given email.
    const user = await this.database.users.findUnique({
      where: { email },
    });

    // if not found.
    if (!user) {
      throw new NotFoundException('user not found.');
    }

    // check if user reads this comment?
    const commentReadHistory = await this.database.commentReadHistory.findUnique({
      where: {
        userId_commentId: {
          userId: user.id,
          commentId: commentId,
        },
      },
    });

    if (commentReadHistory) {
      throw new NotAcceptableException('one user read one comment only once.');
    }

    await this.database.commentReadHistory.create({
      data: {
        userId: user.id,
        commentId: commentId,
      },
    });

    await this.database.comment.update({
      where: { id: commentId },
      data: { readCounter: comment.readCounter + 1 },
    });

    // success.
    return { message: 'user reads the comment successfully.' };
  }

  async usersReadOne(commentId: string): Promise<Object> {
    // if comment id is missed.
    if (!commentId) {
      throw new NotAcceptableException('comment id is missing.');
    }

    // find the comment by the given id.
    const comment = await this.database.comment.findUnique({
      where: { id: commentId },
    });

    // if not found.
    if (!comment) {
      throw new NotFoundException('comment not found.');
    }

    const commentReadHistory = await this.database.commentReadHistory.findMany({
      where: { commentId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
          },
        },
      },
    });

    return commentReadHistory;
  }


  /**
   * update one comment by its id.
   */
  async updateOne(commentId: string, comment: Comment): Promise<Object> {
    if (!commentId) {
      throw new NotAcceptableException('id missed.');
    }

    const searchedComment = await this.database.comment.findUnique({
      where: { id: commentId },
    });

    if (!searchedComment) {
      throw new NotFoundException('comment not found with this id.');
    }

    try {
      await this.database.comment.update({
        where: { id: searchedComment.id },
        data: {
          body: comment.body,
          updatedAt: new Date(),
        },
      });
      // success.
      return { message: 'your comment has been updated safely.' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async deleteOne(commentId: string): Promise<Object> {
    if (!commentId) {
      throw new NotAcceptableException('id missed.');
    }

    //
    const comment = await this.database.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('comment not found with this id.');
    }

    await this.database.comment.delete({
      where: { id: commentId },
    });

    return { message: 'Comment has been deleted successfully.' };
  }

  async deleteManyByCourseTitle(courseTitle: string){
    if(!courseTitle){
      throw new NotAcceptableException('Course title is required.')
    }
    const course = await this.database.course.findUnique({
      where: {title: courseTitle }
    })

    if(!course){
      throw new NotFoundException('course not found.')
    }

    const comments = await this.database.comment.findMany({
      where: { courseId: course.id }
    })

    if(comments.length == 0 ){
      throw new NotFoundException('comment under this course is not found yet')
    }
    await this.database.comment.deleteMany({
      where: { courseId: course.id },
    });

    return { message: 'Comments under this course has been deleted successfully.' };
  }
}
