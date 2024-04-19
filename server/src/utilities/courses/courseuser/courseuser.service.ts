import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CourseUserService {
  constructor(private database: PrismaService) {}

  /**
   *
   * @param courseTitle
   * @param email
   * @returns
   *
   * This method will enroll one user to one course only once.
   */
  async register(courseTitle: string, email: string): Promise<Object> {
    // check if course title is not given.
    if (!courseTitle) {
      throw new NotAcceptableException('Course title is required.');
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
    const user = await this.database.users.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check, if this user already enrolled to this course?.
    const isEnrolled = await this.database.courseUsers.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (isEnrolled) {
      throw new NotAcceptableException('one user can enroll to one course only once.');
    }
    // if user is new to this course, enroll the user.
    await this.database.courseUsers.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });
    return { message: 'new user has enrolled this course successfully !' };
  }

  /**
   * find course progress for one user.
   */
  async findMyCourseProgress(courseId: string, courseUserId: string): Promise<number> {
    // find course materials under this course, only for count.
    const courseMaterials = await this.database.courseMaterials.findMany({
      where: { courseId },
    });

    // calculate the total credit hour of the course.
    let totalCrhrOfCourse = 0;
    for (let index = 0; index < courseMaterials.length; index++) {
      // sum up the credit hour of the course.
      totalCrhrOfCourse += courseMaterials[index].crhr;
    }

    // Find all completed course materials taken by this user under this course.
    const completedMaterialEnrollment = await this.database.courseMaterials_courseUsers.findMany({
      where: { courseUserId, status: 'COMPLETED' },
    });

    // calculate the credit hour of the course which user finishes including the new update.
    let totalCrhrOfCourseUserFinished = 0;
    for (let index = 0; index < completedMaterialEnrollment.length; index++) {
      const finishedMaterial = await this.database.courseMaterials.findUnique({
        where: { id: completedMaterialEnrollment[index].courseMaterialId },
      });
      totalCrhrOfCourseUserFinished += finishedMaterial.crhr;
    }
    // calculate the user progress.
    const progress = (totalCrhrOfCourseUserFinished * 100) / totalCrhrOfCourse;

    let status: string;
    if (progress) {
      if (progress < 100) {
        status = 'PROGRESS';
      } else {
        status = 'COMPLETED';
      }
    }
    await this.database.courseUsers.update({
      where: { id: courseUserId },
      data: {
        status: status,
      },
    });
    return progress;
  }

  /**
   * Find all enrollments throughout the system.
   * This will help us at admin side.
   */
  async findAll(): Promise<Object> {
    const allEnrollment = await this.database.courseUsers.findMany({
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollment.length; i++) {
      allEnrollment[i]['progress'] = await this.findMyCourseProgress(allEnrollment[i].courseId, allEnrollment[i].id);
    }
    return allEnrollment;
  }

  /**
   * Find all completed enrollments throughout the system.
   * This will help us at admin side.
   */
  async findAllDone() {
    const allEnrollmentDone = await this.database.courseUsers.findMany({
      where: { status: 'COMPLETED' },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollmentDone.length; i++) {
      allEnrollmentDone[i]['progress'] = await this.findMyCourseProgress(
        allEnrollmentDone[i].courseId,
        allEnrollmentDone[i].id,
      );
    }
    return allEnrollmentDone;
  }

  /**
   * Find all in progress enrollments throughout the system.
   * This will help us at admin side.
   */
  async findAllProgress() {
    const allEnrollmentProgress = await this.database.courseUsers.findMany({
      where: {
        status: 'PROGRESS',
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollmentProgress.length; i++) {
      allEnrollmentProgress[i]['progress'] = await this.findMyCourseProgress(
        allEnrollmentProgress[i].courseId,
        allEnrollmentProgress[i].id,
      );
    }
    return allEnrollmentProgress;
  }

  /**
   * Find all started(zero progress) enrollments throughout the system.
   * This will help us at admin side.
   */
  // async findAllStarted() {
  //   const allEnrollmentStarted = await this.database.courseUsers.findMany({
  //     where: { status: 'STARTED' },
  //     include: {
  //       course: {
  //         select: {
  //           title: true,
  //           description: true,
  //         },
  //       },
  //       user: {
  //         select: {
  //           email: true,
  //         },
  //       },
  //     },
  //   });
  //   for (let i = 0; i < allEnrollmentStarted.length; i++) {
  //     allEnrollmentStarted[i]['progress'] = await this.findMyCourseProgress(
  //       allEnrollmentStarted[i].courseId,
  //       allEnrollmentStarted[i].id,
  //     );
  //   }
  //   return allEnrollmentStarted;
  // }

  /**
   * Find all completed enrollments for specific team.
   * This will help us at manager side.
   */
  async findAllForTeam(teamName: string) {
    // If team name is not provided.
    if (!teamName) {
      throw new NotAcceptableException('Team name required!');
    }

    // If the team name is valid take the team id.
    const team = await this.database.team.findUnique({
      where: { teamName: teamName },
    });

    // If the provided team name is not registered name
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const allEnrollmentForTeam = await this.database.courseUsers.findMany({
      where: {
        user: {
          teamId: team.id,
        },
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollmentForTeam.length; i++) {
      allEnrollmentForTeam[i]['progress'] = await this.findMyCourseProgress(
        allEnrollmentForTeam[i].courseId,
        allEnrollmentForTeam[i].id,
      );
    }
    return allEnrollmentForTeam;
  }

  /**
   * Find all completed enrollments for specific team.
   * This will help us at manager side.
   */
  async findAllDoneForTeam(teamName: string) {
    // If team name is not provided.
    if (!teamName) {
      throw new NotAcceptableException('Team name required!');
    }

    // If the team name is valid take the team id.
    const team = await this.database.team.findUnique({
      where: { teamName: teamName },
    });

    // If the provided team name is not registered name
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const allEnrollmentDoneForTeam = await this.database.courseUsers.findMany({
      where: {
        status: 'COMPLETED',
        user: {
          teamId: team.id,
        },
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollmentDoneForTeam.length; i++) {
      allEnrollmentDoneForTeam[i]['progress'] = await this.findMyCourseProgress(
        allEnrollmentDoneForTeam[i].courseId,
        allEnrollmentDoneForTeam[i].id,
      );
    }
    return allEnrollmentDoneForTeam;
  }

  /**
   * Find all in progress enrollments in specific team.
   * This will help us at manager side.
   */
  async findAllProgressForTeam(teamName: string) {
    // If team name is not provided.
    if (!teamName) {
      throw new NotAcceptableException('Team name required!');
    }

    // If the team name is valid take the team id.
    const team = await this.database.team.findUnique({
      where: { teamName: teamName },
    });

    // If the provided team name is not registered name
    if (!team) {
      throw new NotFoundException('Team not found');
    }

    const allEnrollmentProgressForTeam = await this.database.courseUsers.findMany({
      where: {
        status: 'PROGRESS',
        user: {
          teamId: team.id,
        },
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < allEnrollmentProgressForTeam.length; i++) {
      allEnrollmentProgressForTeam[i]['progress'] = await this.findMyCourseProgress(
        allEnrollmentProgressForTeam[i].courseId,
        allEnrollmentProgressForTeam[i].id,
      );
    }
    return allEnrollmentProgressForTeam;
  }

  /**
   * Find all started which is (zero progress) enrollments in specific team.
   * This will help us at manager side.
   */
  // async findAllStartedForTeam(teamName: string) {
  //   // If team name is not provided.
  //   if (!teamName) {
  //     throw new NotAcceptableException('Team name required!');
  //   }

  //   // If the team name is valid take the team id.
  //   const team = await this.database.team.findUnique({
  //     where: { teamName: teamName },
  //   });

  //   // If the provided team name is not registered name
  //   if (!team) {
  //     throw new NotFoundException('Team not found');
  //   }

  //   const allEnrollmentStartedForTeam = await this.database.courseUsers.findMany({
  //     where: {
  //       status: 'STARTED',
  //       user: {
  //         teamId: team.id,
  //       },
  //     },
  //     include: {
  //       course: {
  //         select: {
  //           title: true,
  //           description: true,
  //         },
  //       },
  //       user: {
  //         select: {
  //           email: true,
  //         },
  //       },
  //     },
  //   });
  //   for (let i = 0; i < allEnrollmentStartedForTeam.length; i++) {
  //     allEnrollmentStartedForTeam[i]['progress'] = await this.findMyCourseProgress(
  //       allEnrollmentStartedForTeam[i].courseId,
  //       allEnrollmentStartedForTeam[i].id,
  //     );
  //   }
  //   return allEnrollmentStartedForTeam;
  // }

  /**
   * this method finds all enrollment for specific user.
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
    const userEnrollment = await this.database.courseUsers.findMany({
      where: {
        userId: users.id,
      },
      include: {
        course: {
          select: {
            title: true,
            description: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    for (let i = 0; i < userEnrollment.length; i++) {
      userEnrollment[i]['progress'] = await this.findMyCourseProgress(userEnrollment[i].courseId, userEnrollment[i].id);
    }
    return userEnrollment;
  }

  /**
   * this method deletes one course enrollment by enrollment id.
   * Usage: cancel enrollment.
   */
  async deleteOneById(enrollmentId: string) {
    // if enrollment id is not provided.
    if (!enrollmentId) {
      throw new NotAcceptableException('history id required.');
    }

    // check the validity of the enrollment id.
    const enrollment = await this.database.courseUsers.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment identified by this id is not found');
    }

    // if found, delete it
    await this.database.courseUsers.delete({
      where: { id: enrollmentId },
    });

    return { message: 'Enrollment deleted successfully.' };
  }

  /**
   * this method will clear all enrollments associated will single user.
   */
  async deleteManyByEmail(email: string) {
    // check if email is not given.
    if (!email) {
      throw new NotAcceptableException('Email is missed.');
    }
    // check for the user email validity
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const enrollment = await this.database.courseUsers.findMany({
      where: { userId: user.id },
    });

    // if not found
    if (enrollment.length == 0) {
      throw new NotFoundException('This user has no enrollment yet.');
    }

    // clear all enrollment related with one person.
    await this.database.courseUsers.deleteMany({
      where: { userId: user.id },
    });

    // success.
    return { message: 'All user enrollments has been cleared successfully' };
  }
}
