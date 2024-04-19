import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MostsearchedcoursesService {
  constructor(private database: PrismaService) {}

  async register(courseId: string, email: string): Promise<Object> {
    // check if course title is not given.
    if (!courseId) {
      throw new NotAcceptableException('Course title is missed.');
    }
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }

    // check for the given course title.
    const course = await this.database.course.findUnique({
      where: { id: courseId },
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

    // if this user searched this course previously, counter should increment.
    const searchHistory = await this.database.mostSearchedCourses.findUnique({
      where: {
        userId_courseId: {
          userId: users.id,
          courseId: course.id,
        },
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            profileImge: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });
    if (searchHistory) {
      // update
      await this.database.mostSearchedCourses.update({
        where: {
          userId_courseId: {
            userId: users.id,
            courseId: course.id,
          },
        },
        data: {
          counter: searchHistory.counter + 1,
        },
      });

      return { message: 'course accessed successfully!' };
    }

    // if not, this user not searched this course yet, we have to create new row.
    await this.database.mostSearchedCourses.create({
      data: {
        userId: users.id,
        courseId: course.id,
      },
    });
    return { message: 'course access successfully created !' };
  }

  /**
   * Find all history throughout the system.
   * This will help us at admin side.
   */

  async findAll(): Promise<Object> {
    const searchHistory = await this.database.mostSearchedCourses.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            profileImge: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });
    return searchHistory;
  }

  /**
   * this method finds all course history for specific user.
   */
  async findManyByEmail(email: string): Promise<Object> {
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }
    // check for the user email validity
    const users = await this.database.users.findUnique({
      where: { email },
    });
    if (!users) {
      throw new NotFoundException('User not found');
    }

    // search many by user id.
    const searchHistory = await this.database.mostSearchedCourses.findMany({
      where: {
        userId: users.id,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            profileImge: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });
    return searchHistory;
  }

  /**
   * this method deletes one history by its id.
   */
  async deleteOneById(historyId: string) {
    // if history id is not provided.
    if (!historyId) {
      throw new NotAcceptableException('history id missed');
    }

    // check the validity of the history id.
    const history = await this.database.mostSearchedCourses.findUnique({
      where: { id: historyId },
    });

    if (!history) {
      throw new NotFoundException('History not found');
    }

    // if found, delete it
    await this.database.mostSearchedCourses.delete({
      where: { id: historyId },
    });

    return { message: 'one history deleted successfully.' };
  }

  /**
   * this method will clear all history associated will single user.
   */
  async deleteAllByEmail(email: string) {
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }
    // check for the user email validity
    const users = await this.database.users.findUnique({
      where: { email },
    });

    if (!users) {
      throw new NotFoundException('User not found');
    }

    const history = await this.database.mostSearchedCourses.findMany({
      where: { userId: users.id },
    });

    // if not found
    if (history.length == 0) {
      throw new NotFoundException('history not found.');
    }

    // clear all history related with one person.
    await this.database.mostSearchedCourses.deleteMany({
      where: { userId: users.id },
    });

    // success.
    return { message: 'history cleared successfully.' };
  }
}
