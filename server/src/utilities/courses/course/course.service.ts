import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Course, CourseUpdate } from '../../courseDto';

@Injectable()
export class CourseService {
  constructor(private database: PrismaService) {}

  /**
   *
   * @param course
   * @returns
   * Method to register courses.
   */
  async register(course: Course): Promise<Object> {
    // check wether the provided category is found.
    const category = await this.database.category.findUnique({
      where: { categoryName: course.categoryName },
    });

    if (!category) {
      throw new NotFoundException('Category not found. Hint: you have to register the category first.');
    }

    // check for the uniqueness of course title.
    const preCourse = await this.database.course.findUnique({
      where: { title: course.title },
    }); 

    // if not pre registered course with the provided course title.
    if (!preCourse) {
      // registration.
      const registeredCourse = await this.database.course.create({
        data: {
          title: course.title,
          description: course.description,
          categotyId: category.id, // id of the provided category name.
        },
      });

      if (!registeredCourse) {
        throw new InternalServerErrorException('error while registration.');
      }

      return { message: 'course registered successfully.' };
    } else {
      throw new NotAcceptableException('Course title must be unique.');
    }
  }

  async findSingleCourseProgress(courseId: string): Promise<number> {
    // if there is a user in-rolled to the course. calculate the enrolled users progress separately.
    const findMembers = await this.database.users.findMany();
    // count all users that are expected to take this course.
    const learnersCount = findMembers.length;
    // calculate total progress of course has to be achieved.
    const totalCourseProgress = learnersCount * 100;
    // find course materials under this course.
    const courseMaterials = await this.database.courseMaterials.findMany({
      where: { courseId },
    });

    if (courseMaterials.length == 0) {
      return 0;
    }

    // calculate the total credit hour of the course.
    let totalCrhrOfCourse = 0;
    for (let index = 0; index < courseMaterials.length; index++) {
      // sum up the credit hour of the course.
      totalCrhrOfCourse += courseMaterials[index].crhr;
    }

    let completedMaterialEnrollment = [];
    // Find all materialId of this course which has completed status.
    for (let i = 0; i < courseMaterials.length; i++) {
      // find for one id.
      const completedMaterialEnrollmentOfOneId = await this.database.courseMaterials_courseUsers.findMany({
        where: { courseMaterialId: courseMaterials[i].id, status: 'COMPLETED' },
      });
      if (completedMaterialEnrollmentOfOneId.length > 0) {
        for (let j = 0; j < completedMaterialEnrollmentOfOneId.length; j++) {
          // console.log(completedMaterialEnrollmentOfOneId[j]);
          completedMaterialEnrollment.push(completedMaterialEnrollmentOfOneId[j]);
        }
      }
    }

    // calculate the credit hour of the course which user finishes including the new update.
    let totalCrhrOfCourseUsersFinished = 0;
    for (let index = 0; index < completedMaterialEnrollment.length; index++) {
      const finishedMaterial = await this.database.courseMaterials.findUnique({
        where: { id: completedMaterialEnrollment[index].courseMaterialId },
      });
      totalCrhrOfCourseUsersFinished += finishedMaterial.crhr;
    }
    const completedProgress = (totalCrhrOfCourseUsersFinished * 100) / totalCrhrOfCourse;
    const progressInPercent = (completedProgress * 100) / totalCourseProgress;
    return progressInPercent;
  }

  async findAll(): Promise<Object> {
    // read all available courses from database.
    const courses = await this.database.course.findMany({
      include: {
        category: {
          select: {
            categoryName: true,
            description: true,
          },
        },
        courseMaterials: true,
        courseUsers: true,
        searchInfos: true,
        comments: true,
      },
    });
    for (let i = 0; i < courses.length; i++) {
      courses[i]['progress'] = await this.findSingleCourseProgress(courses[i].id);
    }
    // success
    return courses;
  }

  async findOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id missed');
    }
    // find one course by its id
    const courses = await this.database.course.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            categoryName: true,
            description: true,
          },
        },
        courseMaterials: true,
        courseUsers: true,
        searchInfos: true,
        comments: true,
      },
    });
    if (!courses) {
      throw new NotFoundException('course not found');
    }
    courses['progress'] = await this.findSingleCourseProgress(courses.id);
    return courses;
  }

  async findOneByName(title: string): Promise<Object> {
    if (!title) {
      throw new NotAcceptableException('Id is missed');
    }
    // find a course by its title. and include all related info with it.
    const courses = await this.database.course.findUnique({
      where: { title: title },
      include: {
        category: {
          select: {
            categoryName: true,
            description: true,
          },
        },
        courseMaterials: true,
        courseUsers: true,
        searchInfos: true,
        comments: true,
      },
    });
    if (!courses) {
      throw new NotFoundException('course not found');
    }
    courses['progress'] = await this.findSingleCourseProgress(courses.id);
    return courses;
  }

  async updateOne(id: string, course: CourseUpdate): Promise<Object> {
    // check if id is not provided
    if (!id) {
      throw new NotAcceptableException('id is missed');
    }

    // check if the course is not found identified by the given id.
    const crs = await this.database.course.findUnique({
      where: { id },
    });

    // if not found
    if (!crs) {
      throw new NotFoundException('course not found, identified by the given id.');
    }

    if (course.title == crs.title) {
      // the same title is replaced so, it is unique.
      const updatedCourse = await this.database.course.update({
        where: { id: crs.id },
        data: {
          title: course.title,
          description: course.description,
        },
      });
      // if not updated well
      if (!updatedCourse) {
        throw new InternalServerErrorException('Internal server error, while updating.');
      }
    } else {
      // if this two titles are the same we have to check for uniqunes of the given title.
      const temp = await this.database.course.findUnique({
        where: { title: course.title },
      });

      if (!temp) {
        // if the given course title is not in database update course
        const updatedCourse = await this.database.course.update({
          where: { id: crs.id },
          data: {
            title: course.title,
            description: course.description,
          },
        });
        // if not updated well
        if (!updatedCourse) {
          throw new InternalServerErrorException('Internal server error, while updating.');
        }
      } else {
        throw new NotAcceptableException('course title must be unique.');
      }
    }
    return { message: 'course updated successfully.' };
  }

  // find all course progress.
  async getCourseProgress() {
    const courseUsers = await this.database.courseUsers.findMany();

    const newCourseUsers = []; // array to store the userId-progress pairs

    // if there is a user in-rolled to the course. calculate the enrolled users progress separately.
    if (courseUsers.length > 0) {
      const findMembers = await this.database.users.findMany();
      const learnersCount = findMembers.length;
      const totalCourseProgress = learnersCount * 100;

      for (let i = 0; i < courseUsers.length; i++) {
        const courseId = courseUsers[i].courseId;

        // find course materials under this course, only for count.
        const courseMaterials = await this.database.courseMaterials.findMany({
          where: { courseId: courseUsers[i].courseId },
        });

        // calculate the total credit hour of the course.
        let totalCrhrOfCourse = 0;
        for (let index = 0; index < courseMaterials.length; index++) {
          // sum up the credit of the course.
          totalCrhrOfCourse += courseMaterials[index].crhr;
        }

        /**
         *  progress has to be dynamic b/c new material may be added.
         *
         */

        // Find all course materials taken by this user under this course.
        const totalMaterialEnrollment = await this.database.courseMaterials_courseUsers.findMany({
          where: {
            courseUserId: courseUsers[i].id,
            status: 'COMPLETED',
          },
        });
        // calculate the credit hour of the course which user finishes including the new update.
        let totalCrhrOfCourseUsersFinished = 0;
        for (let index = 0; index < totalMaterialEnrollment.length; index++) {
          const finishedMaterial = await this.database.courseMaterials.findUnique({
            where: { id: totalMaterialEnrollment[index].courseMaterialId },
          });
          totalCrhrOfCourseUsersFinished += finishedMaterial.crhr;
        }
        // calculate the user progress.
        let progress = (totalCrhrOfCourseUsersFinished * 100) / totalCrhrOfCourse;

        progress = (progress * 100) / totalCourseProgress;

        const index = newCourseUsers.findIndex((item) => item.courseId === courseId);
        if (index !== -1) {
          // if the courseId already exists in the newCourseUsers array, add the progress to the existing sum
          newCourseUsers[index].progress += progress;
        } else {
          const course = await this.database.course.findUnique({
            where: { id: courseId },
          });
          const courseTitle = course.title;
          // if the courseId does not exist in the newCourseUsers array, create a new object with the userId and set the progress as the value
          newCourseUsers.push({ courseId, courseTitle, progress });
        }
      }
    }

    const allCourses = await this.database.course.findMany();
    for (let i = 0; i < allCourses.length; i++) {
      const courseId = allCourses[i].id;
      const courseTitle = allCourses[i].title;
      const progress = 0;
      const index = newCourseUsers.findIndex((item) => item.courseId === courseId);
      if (index === -1) {
        newCourseUsers.push({ courseId, courseTitle, progress });
      }
    }
    return newCourseUsers;
  }

  /**
   *
   * @param title
   * @returns
   */
  async deleteOneByTitle(title: string) {
    if (!title) {
      throw new NotAcceptableException('Title is required');
    }

    const course = await this.database.course.findUnique({
      where: { title },
    });

    // if not found
    if (!course) {
      throw new NotFoundException('course not found exception.');
    }
    try {
      // delete the resource.
      await this.database.course.delete({
        where: { title },
      });

      // delete successful
      return { message: 'course deleted successfully' };
    } catch (error) {
      throw new NotAcceptableException();
    }
  }

  /**
   *
   * @returns message
   *
   * This function will delete all course from database.
   */
  async deleteAll() {
    const courses = await this.database.course.findMany();

    // if not found
    if (courses.length == 0) {
      throw new NotFoundException('courses not found.');
    }
    try {
      // wait for deletion.
      await this.database.course.deleteMany();
      // delete successful
      return { message: 'courses deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
