import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseUserService } from '../courseuser/courseuser.service';

@Injectable()
export class MaterialuserService {
  // constructor for prisma.
  constructor(private database: PrismaService, private courseUserService: CourseUserService) {}

  /**
   *
   * @param courseMaterialTitle
   * @param email
   * @returns
   *
   * This method will enroll one user to one course-material only once.
   */
  async register(courseMaterialTitle: string, email: string): Promise<Object> {
    // check if the title of the course material is not given.
    if (!courseMaterialTitle) {
      throw new NotAcceptableException('Course title is missed.');
    }
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }

    // check for the given title of the material is correct.
    const courseMaterial = await this.database.courseMaterials.findUnique({
      where: { title: courseMaterialTitle },
    });
    if (!courseMaterial) {
      throw new NotFoundException('Course material with this title is not found');
    }
    // check for the user email validity
    const user = await this.database.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check for the given title of the material is correct.
    const isEnrolledToCourse = await this.database.courseUsers.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseMaterial.courseId,
        },
      },
    });
    if (!isEnrolledToCourse) {
      throw new NotAcceptableException('This user has not enrolled to the Course which this material is belong.');
    }

    // check if this user is already enrolled to this material. b/c one user can enroll to specific material only once.
    const isEnrolledToMaterial = await this.database.courseMaterials_courseUsers.findUnique({
      where: {
        courseUserId_courseMaterialId: {
          courseUserId: isEnrolledToCourse.id,
          courseMaterialId: courseMaterial.id,
        },
      },
    });

    if (isEnrolledToMaterial) {
      throw new NotAcceptableException('This user had already enrolled to this material.');
    }

    // enroll the user to the given course material.
    await this.database.courseMaterials_courseUsers.create({
      data: {
        courseUserId: isEnrolledToCourse.id,
        courseMaterialId: courseMaterial.id,
      },
    });

    await this.database.courseUsers.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseMaterial.courseId,
        },
      },
      data: {
        status: 'PROGRESS',
      },
    });

    return { message: 'This user has enrolled to new course material, successfully.' };
  }

  /**
   *
   * @param courseMaterialId
   * @param email
   * @returns
   *
   * register newly done with out register, material.
   */
  async doneWithoutRegister(courseMaterialId: string, email: string): Promise<Object> {
    // check if the id of the course material is not given.
    if (!courseMaterialId) {
      throw new NotAcceptableException('Course id is missed.');
    }
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }

    // check for the given id of the material is correct.
    const courseMaterial = await this.database.courseMaterials.findUnique({
      where: { id: courseMaterialId },
    });

    if (!courseMaterial) {
      throw new NotFoundException('Course material with this id is not found');
    }

    // check for the user email validity
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    // check if this user enrolled to this course.
    const isEnrolledToCourse = await this.database.courseUsers.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseMaterial.courseId,
        },
      },
    });

    if (!isEnrolledToCourse) {
      throw new NotAcceptableException('This user has not enrolled to thi Course.');
    }

    // check if this user is already enrolled to this material. b/c one user can enroll to specific material only once.
    const isEnrolledToMaterial = await this.database.courseMaterials_courseUsers.findUnique({
      where: {
        courseUserId_courseMaterialId: {
          courseUserId: isEnrolledToCourse.id,
          courseMaterialId: courseMaterial.id,
        },
      },
    });

    if (isEnrolledToMaterial) {
      throw new NotAcceptableException('This user had already enrolled to this material.');
    }

    // enroll the user to the given course material.
    await this.database.courseMaterials_courseUsers.create({
      data: {
        status: 'COMPLETED',
        completedTime: new Date(),
        courseUserId: isEnrolledToCourse.id,
        courseMaterialId: courseMaterial.id,
      },
    });

    // find the user progress at this course.
    const userProgress = await this.courseUserService.findMyCourseProgress(
      courseMaterial.courseId,
      isEnrolledToCourse.id,
    );
    // console.log('userProgress: ', userProgress);
    let userStatus = 'PROGRESS';
    let userCompletedTime = null;
    if (userProgress >= 100) {
      userStatus = 'COMPLETED';
      userCompletedTime = new Date();
    }
    // update the progress of the user for that course.
    await this.database.courseUsers.update({
      where: { id: isEnrolledToCourse.id },
      data: {
        status: userStatus,
        completedTime: userCompletedTime,
      },
    });

    return { message: 'This user has completed this course material, successfully.' };
  }

  /**
   *
   * @param courseTitle
   * @param email
   * @returns
   *  Find all course material enrollments for specific  [course and users].
   */
  async findManyByCourseUser(courseTitle: string, email: string) {
    // check if the title of the course is not given.
    if (!courseTitle) {
      throw new NotAcceptableException('Course title is required.');
    }
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is required.');
    }

    // check for the given title of the material is correct.
    const course = await this.database.course.findUnique({
      where: { title: courseTitle },
    });

    if (!course) {
      throw new NotFoundException('Course identified by this title is not found');
    }
    // check for the user email validity
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check, if this user is enrolled to this course?.
    const isEnrolled = await this.database.courseUsers.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });
    if (!isEnrolled) {
      throw new NotAcceptableException('This user has not enrolled to this course.');
    }

    // find all enrolled materials for given user and course.
    const courseUsers = await this.database.courseUsers.findUnique({
      where: { id: isEnrolled.id },
      include: {
        course: {
          select: {
            title: true,
            description: true,
            courseMaterials: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    return courseUsers;
  }

  /**
   *
   * @param courseMaterialEnrollmentId
   * @returns
   * updateOne method will change status of the user for the one material,
   * from PROGRESS to COMPLETED and it will set the completion time.
   */
  async updateOneById(courseMaterialEnrollmentId: string) {
    // check if the id is not given?
    if (!courseMaterialEnrollmentId) {
      throw new NotAcceptableException('courseMaterialEnrollmentId is required.');
    }

    // check the validity of courseMaterialEnrollmentId
    const courseMaterialEnrollment = await this.database.courseMaterials_courseUsers.findUnique({
      where: { id: courseMaterialEnrollmentId },
    });

    if (!courseMaterialEnrollment) {
      throw new NotFoundException('No courseMaterialEnrollment with the given id.');
    }

    await this.database.courseMaterials_courseUsers.update({
      where: { id: courseMaterialEnrollment.id },
      data: {
        status: 'COMPLETED',
      },
    });

    // check if this enrollment is already completed.
    if (courseMaterialEnrollment.status == 'COMPLETED') {
      throw new NotAcceptableException('This enrollment is already completed.');
    }

    // find course enrollment of the user.
    const courseUser = await this.database.courseUsers.findUnique({
      where: { id: courseMaterialEnrollment.courseUserId },
    });

    if (!courseUser) {
      // this may not be executed.
      throw new NotFoundException('user has not enrolled to this course yet.');
    }

    // find the user progress at this course.
    const userProgress = await this.courseUserService.findMyCourseProgress(courseUser.courseId, courseUser.id);
    console.log('userProgress: ', userProgress);
    let userStatus = 'PROGRESS';
    let userCompletedTime = null;
    if (userProgress >= 100) {
      userStatus = 'COMPLETED';
      userCompletedTime = new Date();
    }

    // update the progress of the user for that course.
    await this.database.courseUsers.update({
      where: { id: courseMaterialEnrollment.courseUserId },
      data: {
        status: userStatus,
        completedTime: userCompletedTime,
      },
    });

    // success
    return { message: 'Course material COMPLETED.' };
  }

  /**
   * This method deletes one material enrollment by its id.
   * Usage: cancel enrollment.
   */
  async deleteOneById(enrollmentId: string) {
    // if enrollment id is not provided.
    if (!enrollmentId) {
      throw new NotAcceptableException('history id required.');
    }

    // check the validity of the enrollment id.
    const enrollment = await this.database.courseMaterials_courseUsers.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Material enrollment identified by this id is not found');
    }

    // if found, delete it
    await this.database.courseMaterials_courseUsers.delete({
      where: { id: enrollmentId },
    });

    return { message: 'Enrollment deleted successfully.' };
  }
}
