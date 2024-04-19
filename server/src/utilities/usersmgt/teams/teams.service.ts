import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Team } from '../../usermgtDto';
@Injectable()
export class TeamsService {
  constructor(private database: PrismaService) {}

  // register single team once.
  async registerOne(team: Team): Promise<Object> {
    // check if team name is pre registered.
    const preRegistered = await this.database.team.findUnique({
      where: { teamName: team.teamName },
    });

    // if not registered
    if (!preRegistered) {
      await this.database.team.create({
        data: {
          teamName: team.teamName,
          description: team.description,
        },
      });
      // return success message.
      return { message: 'team created successfully.' };
    } else {
      throw new NotAcceptableException('team name must be unique.');
    }
  }

  // fetch all team once
  async findAll() {
    const allTeam = await this.database.team.findMany();
    return allTeam;
  }

  // find one team by its id
  async findOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id missed');
    }
    // find one team by its id.
    const team = await this.database.team.findUnique({
      where: { id },
    });
    if (!team) {
      throw new NotFoundException('team not found.');
    }
    return team;
  }

  // find team name by user email.
  async findTeamNameByEmail(email: string): Promise<Object> {
    if (!email) {
      throw new NotAcceptableException('email is required.');
    }
    const user = await this.database.users.findUnique({
      where: { email },
      include: {
        team: true,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found.');
    }

    return user.team;
  }

  // find one team by its name.
  async findOneByName(teamName: string) {
    if (!teamName) {
      throw new NotAcceptableException('id missed');
    }
    // find one team by its team name.
    const team = await this.database.team.findUnique({
      where: { teamName },
    });

    if (!team) {
      throw new NotFoundException('team not found.');
    }
    return team;
  }

  // update one team by its id.
  async updateOne(teamId: string, team: Team) {
    // if team id is missed.
    if (!teamId) {
      throw new NotAcceptableException('team id is missing.');
    }

    // find the team by the given id.
    const res = await this.database.team.findUnique({
      where: { id: teamId },
    });

    // if not found.
    if (!res) {
      throw new NotFoundException('team not found.');
    }

    // if this two team-names are not equal I have to check the uniqueness of the given team name.
    if (team.teamName != res.teamName) {
      const temp = await this.database.team.findUnique({
        where: { teamName: team.teamName },
      });

      // not other name that match with the given team name.
      if (!temp) {
        const updatedTeam = await this.database.team.update({
          where: { id: teamId },
          data: {
            teamName: team.teamName,
            description: team.description,
          },
        });

        // if not updated well, this is may be internal server error.
        if (!updatedTeam) {
          throw new InternalServerErrorException('Internal server error while updating.');
        }
      } else {
        throw new NotAcceptableException('team name must be unique.');
      }
    } else {
      const updatedTeam = await this.database.team.update({
        where: { id: teamId },
        data: {
          teamName: team.teamName,
          description: team.description,
        },
      });
      // if not updated well, this is may be internal server error.
      if (!updatedTeam) {
        throw new InternalServerErrorException('Internal server error while updating.');
      }
    }
    // success.
    return { message: 'your team has been updated succeffuly.' };
  }

  // delete one team once, by its id.
  async deleteOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id is required');
    }

    // find team
    const res = await this.database.team.findUnique({
      where: { id },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('team not found exception.');
    }

    // try {
    // delete the team.
    const deletedRes = await this.database.team.delete({
      where: { id },
    });
    if (!deletedRes) {
      throw new NotFoundException('team not found');
    }
    return { message: 'team has been deleted successfully.' };
  }

  // delete one team once, by its id.
  async deleteOneByName(teamName: string): Promise<Object> {
    if (!teamName) {
      throw new NotAcceptableException('team name missing.');
    }

    // find team
    const res = await this.database.team.findUnique({
      where: { teamName },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('team not found exception.');
    }
 
    // delete the team.
    await this.database.team.delete({
      where: { teamName },
    });

    return { message: 'team has been deleted successfully.' };
  }

  // delete all team once.
  async deleteAll() {
    // find team
    const res = await this.database.team.findMany();

    // if not found
    if (res.length == 0) {
      throw new NotFoundException('team not found exception.');
    }

    // delete teams
    await this.database.team.deleteMany();

    // return success message
    return { message: 'team has been deleted successfully' };
  }
}
