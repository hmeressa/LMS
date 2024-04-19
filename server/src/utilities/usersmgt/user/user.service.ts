import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PositionChange, RoleName, TeamName, Users, UsersUpdate } from '../../usermgtDto';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from '../../../email/email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class UserService {
  constructor(private database: PrismaService, private emailService: EmailService) {}

  // check if network is not available
  async internetConnectivity(): Promise<boolean> {
    try {
      await fetch('https://www.gmail.com');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @Body : You can find at the model.
   * @returns message in the form of an object.
   *
   * This function will generate unique default password for users.
   */

  async registerUser(@Body() user: Users): Promise<Object> {
    // find one user by email.
    const emailFound = await this.database.users.findUnique({
      where: { email: user.email },
    });

    if (emailFound) {
      throw new NotAcceptableException('Email must be unique.');
    }

    // find role id by role name.
    const role = await this.database.role.findUnique({
      where: { roleName: user.roleName },
    });

    if (!role) {
      throw new NotAcceptableException('Role name incorrect.');
    }

    // find team id by team name.
    const team = await this.database.team.findUnique({
      where: { teamName: user.teamName },
    });

    if (!team) {
      throw new NotAcceptableException('Team name incorrect.');
    }

    const networkAvailable = await this.internetConnectivity();

    if (networkAvailable) {
      try {
        // get random 8 digit hexadecimal string.
        const password = randomBytes(4).toString('hex');
        const salt = 10;
        const hash = await bcrypt.hash(password, salt);

        const registeredUser = await this.database.users.create({
          data: {
            firstName: user.firstName,
            lastName: user.lastName,

            email: user.email,
            password: hash,
            position: user.position.toUpperCase(),

            phone: user.phone,
            gender: user.gender.toUpperCase(),

            roleId: role.id,
            teamId: team.id,
          },
        });
        const fullName = user.firstName + ' ' + user.lastName;
        // send the default password for the password.
        await this.emailService.sendNoticeAccountCreated(registeredUser.email, password, fullName);
        return {
          message: 'user registered successfully. and we have sent default password via an email.',
        };
      } catch (error) {
        await this.database.users.delete({
          where: { email: user.email },
        });

        throw new InternalServerErrorException(error);
      }
    } else {
      throw new NotFoundException('check your internet connectivity.');
    }
  }
  /**
   *
   * @returns all users at ones, if there is inde database.
   */

  async findAllUsers(): Promise<Object> {
    // fetch user data with role.
    const users = this.database.users.findMany({
      select: {
        id: true,
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
        role: {
          select: {
            roleName: true,
            description: true,
            privileges: {
              include: {
                resource: true,
              },
            },
          },
        },
        team: {
          select: {
            teamName: true,
            description: true,
          },
        },
      },
    });

    if (!users) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  /**
   *
   * @param id
   * @returns
   *
   * finds one user by its id.
   */
  async findOneById(id: string) {
    // read one users data by its id.
    const user = await this.database.users.findUnique({
      where: { id },
      select: {
        id: true,
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
        role: {
          select: {
            roleName: true,
            description: true,
            privileges: {
              include: {
                resource: true,
              },
            },
          },
        },
        team: {
          select: {
            teamName: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found, whith id: ${id}`);
    }

    return user;
  }

  /**
   *
   * @param email
   * @returns User
   *
   * finds one user with its role, by its email.
   */
  async findOneByEmail(email: string) {
    // find user by its email with its role.
    const user = await this.database.users.findUnique({
      where: { email },
      select: {
        id: true,
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
        role: {
          select: {
            roleName: true,
            description: true,
            privileges: {
              include: {
                resource: true,
              },
            },
          },
        },
        team: {
          select: {
            teamName: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  /**
   *
   * @param email
   * @returns User
   *
   * find user by email without its role.
   */
  async findOneByEmailWithoutRole(email: string) {
    if (!email) {
      throw new NotAcceptableException('Email missing');
    }

    // read user from database by email without its role.
    const user = await this.database.users.findUnique({
      where: { email },
      select: {
        id: true,
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
    });

    // user not found.
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  /**
   *
   * @param user
   * @returns
   *
   * Update
   */
  async updateOne(userId: string, user: UsersUpdate) {
    // if user id is not given.
    if (!userId) {
      throw new NotFoundException('User id missing.');
    }

    // update user info then take the updated info.
    /**
     * Here we will update partial field of the user.
     *   - all auth related info will be updated at auth.
     *   - profile image will be updated alone by the user.
     *   - time related attribute will be updated automatically as necessary.
     *   - position and teamId will be updated by its manager or admin.
     */
    const updatedUser = await this.database.users.update({
      where: { id: userId },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        updatedAt: new Date(),
      },
    });
    // if incorrect id is provided.
    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    // update successful
    return { massage: 'User updated successfully' };
  }

  async positionChange(userId: string, positionObj: PositionChange) {
    // if user id is not given.
    if (!userId) {
      throw new NotFoundException('User id missing.');
    }

    // update user position then take the updated info.
    const updatedUser = await this.database.users.update({
      where: { id: userId },
      data: {
        position: positionObj.position,
        updatedAt: new Date(),
      },
    });
    // if incorrect id is provided.
    if (!updatedUser) {
      throw new NotFoundException('User not found.');
    }

    // update successful
    return { massage: 'User updated successfully' };
  }

  async teamChange(userId: string, teamN: TeamName) {
    // if user id is not given.
    if (!userId) {
      throw new NotFoundException('User id missing.');
    }

    const team = await this.database.team.findUnique({
      where: { teamName: teamN.teamName },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    // check, if incorrect id is provided.
    const user = await this.database.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // update user info then take the updated info.
    await this.database.users.update({
      where: { id: userId },
      data: {
        teamId: team.id,
        updatedAt: new Date(),
      },
    });

    // update successful
    return { massage: 'User updated successfully' };
  }

  async roleChange(userId: string, roleN: RoleName) {
    // if user id is not given.
    if (!userId) {
      throw new NotFoundException('User id missing.');
    }

    const role = await this.database.role.findUnique({
      where: { roleName: roleN.roleName },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // check, if incorrect id is provided.
    const user = await this.database.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // update user info then take the updated info.
    await this.database.users.update({
      where: { id: userId },
      data: {
        roleId: role.id,
        updatedAt: new Date(),
      },
    });

    // update successful
    return { massage: 'User updated successfully' };
  }

  /**
   * @param email
   * @returns message
   *
   * This function will delete one user data by their email.
   */
  async deleteOneByEmail(email: string) {
    if (!email) {
      throw new NotAcceptableException('email missing');
    }

    const user = this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User identified by this email is not found');
    }
    // delete the users data.
    await this.database.users.delete({
      where: { email },
    });

    // delete successful
    return { message: 'User deleted successfully' };
  }

  /**
   * @param userId
   * @returns message
   *
   * This function will delete one user data by their id.
   */
  async deleteOneById(userId: string) {
    if (!userId) {
      throw new NotAcceptableException('id missing');
    }

    const user = this.database.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User identified by this id is not found');
    }
    // delete the users data.
    await this.database.users.delete({
      where: { id: userId },
    });

    // delete successful
    return { message: 'User deleted successfully' };
  }

  /**
   *
   * @returns response message.
   *
   * This function will delete all user info from database.
   */
  async deleteAll() {
    // find all users
    const user = await this.database.users.findMany();
    // if not found
    if (user.length == 0) {
      throw new NotFoundException('User not found, to delete');
    }
    // wait for deletion
    await this.database.users.deleteMany();
    // success message
    return { message: 'All users have been deleted successfully' };
  }
}
