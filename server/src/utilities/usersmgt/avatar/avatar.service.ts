import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as fs from 'fs-extra';

@Injectable()
export class ProfileImageService {
  constructor(private database: PrismaService) {}

  /**
   *
   * @param email
   * @param avatarPath
   * @returns response object.
   * This method will change or newly add an avatar for the users.
   */
  async profileImageChange(email: string, avatarname: string) {
    // if user email is not given.
    if (!email) {
      throw new NotAcceptableException('User email is required.');
    }
    // check, if incorrect email is provided.
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User identified by this email is not found');
    }

    if (user.profileImge) {
      try {
        await fs.remove(user.profileImge);
      } catch (err) {
        throw new InternalServerErrorException('Failed to delete image');
      }
    }

    // update user info then take the updated info.
    await this.database.users.update({
      where: { email },
      data: {
        profileImge: avatarname,
        updatedAt: new Date(),
      },
    });

    // update successful
    return { massage: 'User profile image updated successfully' };
  }

  async findAvatarName(email: string): Promise<string> {
    if (!email) {
      throw new NotAcceptableException('email is required');
    }
    // check the given email.
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User identified by this email is not found');
    }

    if (!user.profileImge) {
      throw new NotFoundException('User has no profile yet.');
    }

    return user.profileImge;
  }

  /**
   * Delete the avatar of the user.
   */
  async deleteAvatar(email: string): Promise<Object> {
    if (!email) {
      throw new NotAcceptableException('email is required');
    }
    // check the given email.
    const user = await this.database.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User identified by this email is not found');
    }

    try {
      // remove the image from its destination.
      await fs.remove(user.profileImge);
    } catch (err) {
      throw new InternalServerErrorException('Failed to delete an image: Hint user has no profile.');
    }

    try {
      // update the users avatar with null value.
      await this.database.users.update({
        where: { email },
        data: {
          profileImge: null,
          updatedAt: new Date(),
        },
      });

      // update successful
      return { message: 'user profile image deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Internal server error while updating the user info');
    }
  }
}
