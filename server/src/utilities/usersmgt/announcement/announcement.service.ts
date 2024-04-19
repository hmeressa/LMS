import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Announcement } from '../../usermgtDto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(private database: PrismaService) {}

  // register single announcement once.
  async registerOne(email: string, announcement: Announcement): Promise<Object> {
    if (!email) {
      throw new NotAcceptableException('Email missed');
    }

    // check the given email is valid
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotAcceptableException('Email not valid');
    }

    const target = announcement.target; // .toLowerCase();

    // check the target validity
    if (target != 'public') {
      const team = await this.database.team.findUnique({
        where: { teamName: target },
      });
      if (team) {
        await this.database.announcement.create({
          data: {
            title: announcement.title,
            body: announcement.body,
            target: team.id,
            userId: user.id,
          },
        });
        // return success message.
        return { message: 'announcement created successfully.' };
      }

      const targetUser = await this.database.users.findUnique({
        where: { email: target },
      });
      if (targetUser) {
        await this.database.announcement.create({
          data: {
            title: announcement.title,
            body: announcement.body,
            target: targetUser.id,
            userId: user.id,
          },
        });
        // return success message.
        return { message: 'announcement created successfully.' };
      }

      throw new NotAcceptableException(
        'Target of the notification must be one of [valid user email, valid team name, or lower case word `public`.]',
      );
    }

    await this.database.announcement.create({
      data: {
        title: announcement.title,
        body: announcement.body,
        target: announcement.target,
        userId: user.id,
      },
    });
    // return success message.
    return { message: 'announcement created successfully.' };
  }

  // fetch all public announcement once
  async findAll() {
    //    read all
    const allAnnouncement = await this.database.announcement.findMany({
      where: { target: 'public' },
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
    return allAnnouncement;
  }

  // find one announcement by its id
  async findManyByTeamName(teamName: string): Promise<Object> {
    if (!teamName) {
      throw new NotAcceptableException('team name required.');
    }
    const team = await this.database.team.findUnique({
      where: { teamName },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // find many announcements that sent for specific team/group.
    const announcement = await this.database.announcement.findMany({
      where: { target: team.id },
      // include sender info.
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
    return announcement;
  }

  // find many announcement by their email
  async findManyByEmail(email: string): Promise<Object> {
    if (!email) {
      throw new NotAcceptableException('email is required.');
    }

    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!email) {
      throw new NotFoundException('user not found.');
    }

    const announcement = await this.database.announcement.findMany({
      where: { userId: user.id },
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
    return announcement;
  }
  //  findManyAnnouncementSentForMe by their email
  async findManyAnnouncementSentForMe(email: string): Promise<Object> {
    if (!email) {
      throw new NotAcceptableException('email is required.');
    }

    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('user not found.');
    }

    // const userId = user.id;
    // console.log(userId)
    const individualAnnouncements = await this.database.announcement.findMany({
      where: { target: user.id },
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
    return individualAnnouncements;
  }

  // find one announcement by its id
  async findOneById(id: string): Promise<Object> {
    // find one announcement by its id.
    const announcement = await this.database.announcement.findUnique({
      where: { id },
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
    if (!announcement) {
      throw new NotFoundException('announcement not found.');
    }
    return announcement;
  }

  // update one announcement by its id.
  async updateOne(announcementId: string, announcement: Announcement) {
    // if announcement id is missed.
    if (!announcementId) {
      throw new NotAcceptableException('announcement id is missing.');
    }

    // find the announcement by the given id.
    const res = await this.database.announcement.findUnique({
      where: { id: announcementId },
    });

    // if not found.
    if (!res) {
      throw new NotFoundException('announcement not found.');
    }

    const updatedAnnouncement = await this.database.announcement.update({
      where: { id: announcementId },
      data: {
        title: announcement.title,
        body: announcement.body,
      },
    });

    // if not updated well, this is may be internal server error.
    if (!updatedAnnouncement) {
      throw new InternalServerErrorException('Internal server error while updating.');
    }
    // success.
    return { message: 'your announcement has been updated successfully.' };
  }

  // update one announcement by its id. while user reads the announcement.
  async createReadHistory(announcementId: string, email: string) {
    // if announcement id is missed.
    if (!announcementId) {
      throw new NotAcceptableException('announcement id is required.');
    }

    // if user email is missed.
    if (!email) {
      throw new NotAcceptableException('user email is required.');
    }

    // find the announcement by the given id.
    const announcement = await this.database.announcement.findUnique({
      where: { id: announcementId },
    });

    // if not found.
    if (!announcement) {
      throw new NotFoundException('announcement not found.');
    }

    // find the user by the given email.
    const user = await this.database.users.findUnique({
      where: { email },
    });

    // if not found.
    if (!user) {
      throw new NotFoundException('user not found.');
    }

    if (user.id == announcement.userId) {
      throw new NotAcceptableException('writer of the announcement can not read!');
    }

    // check if user reads this announcement?
    const announcementReadHistory = await this.database.announcementReadHistory.findUnique({
      where: {
        userId_announcementId: {
          userId: user.id,
          announcementId: announcementId,
        },
      },
    });

    if (announcementReadHistory) {
      throw new NotAcceptableException('one user read one announcement only once.');
    }

    await this.database.announcementReadHistory.create({
      data: {
        userId: user.id,
        announcementId: announcementId,
      },
    });

    await this.database.announcement.update({
      where: { id: announcementId },
      data: { readCounter: announcement.readCounter + 1 },
    });

    // success.
    return { message: 'user reads the announcement successfully.' };
  }

  async usersReadOne(announcementId: string): Promise<Object> {
    // if announcement id is missed.
    if (!announcementId) {
      throw new NotAcceptableException('announcement id is missing.');
    }

    // find the announcement by the given id.
    const announcement = await this.database.announcement.findUnique({
      where: { id: announcementId },
    });

    // if not found.
    if (!announcement) {
      throw new NotFoundException('announcement not found.');
    }

    const announcementReadHistory = await this.database.announcementReadHistory.findMany({
      where: { announcementId },
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

    return announcementReadHistory;
  }

  // delete one announcement once, by its id.
  async deleteOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id is required');
    }

    // find announcement
    const res = await this.database.announcement.findUnique({
      where: { id },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('announcement not found exception.');
    }

    // delete the announcement.
    const deletedRes = await this.database.announcement.delete({
      where: { id },
    });
    if (!deletedRes) {
      throw new NotFoundException('announcement not found');
    }
    return { message: 'announcement has been deleted successfully.' };
  }

  async deleteManyByTeamName(teamName: string) {
    if (!teamName) {
      throw new NotAcceptableException('team name required.');
    }
    const team = await this.database.team.findUnique({
      where: { teamName },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // find announcements
    const res = await this.database.announcement.findMany({
      where: { target: team.id },
    });

    // if not found
    if (res.length == 0) {
      throw new NotFoundException('announcement not found yet.');
    }

    await this.database.announcement.deleteMany({
      where: { target: team.id },
    });

    // return success message
    return { message: 'announcements for this team has been deleted successfully' };
  }

  // delete all announcements once.
  async deleteAll() {
    // find announcement
    const res = await this.database.announcement.findMany();

    // if not found
    if (res.length == 0) {
      throw new NotFoundException('announcement not found yet.');
    }
    // delete announcements
    await this.database.announcement.deleteMany();

    // return success message
    return { message: 'announcement has been deleted successfully' };
  }
}
