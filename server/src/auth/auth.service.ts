import {
  Body,
  Injectable,
  NotAcceptableException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto, ChangePassword, ForgotPasswordEmail, IsValidCode, ResetPasswordDto } from './dto';
import { EmailService } from '../email/email.service';
import { randomBytes } from 'crypto';
import { NotFoundException } from '../common/Exception/not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private database: PrismaService,
    private config: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // signin service logic.
  async signin(@Body() dto: AuthDto): Promise<Object> {
    // find the user by Email.
    const user = await this.database.users.findUnique({
      where: {
        email: dto.email,
      },
    });

    // if user with this email is not found.
    if (!user) {
      throw new NotFoundException('Email not found.');
    }

    // compare the password with
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    // if provided password is incorrect
    if (!passwordMatch) {
      throw new UnauthorizedException('password mismach');
    }

    // send back the user
    delete user.password;
    // return await this.signToken(user.id, user.email);

    user['token'] = await this.signToken(user.id, user.email);

    // this verifies as the user token is updated
    const updatedUser = await this.database.users.findUnique({
      where: { id: user.id },
    });

    delete updatedUser.password;
    delete updatedUser.verificationCode;

    return updatedUser;
  }

  // This method generates a token from user id and email.
  async signToken(userId: string, email: string): Promise<string> {
    // payload is materials used by jwtService to generate unique token.
    const payload = {
      sub: userId,
      email,
    };

    // secret code assigned at .env file. used to generate token.
    const secret = this.config.get('JWT_SECRET');

    // generate token
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '24h', // this token will be valid for 24 hour only.
      secret: secret,
    });

    // update the database with new v.code and token.
    await this.database.users.update({
      where: { id: userId },
      data: {
        token: token,
        lastLoggedIn: new Date(),
      },
    });

    return token;
  }

  /**
   *
   * @param dtoFPE(it has only email.)
   * @returns
   */

  // forgot password will send verification code for the given email.
  async forgotPassword(dtoFPE: ForgotPasswordEmail): Promise<Object> {
    // find the user by email
    const user = await this.database.users.findUnique({
      where: {
        email: dtoFPE.email,
      },
    });

    // if user does not exist throw an exception.
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const fullName = user.firstName + ' ' + user.lastName;

    // get random reset code that will be sent to user.
    const resetCode = await this.getResetCode(user.id, user.email);

    // send the reset code to the user.
    return this.emailService.sendVerificationCode(user.email, resetCode, fullName);
  }

  /**
   *
   * @param userId
   * @param email
   * @returns verificationCode with is string in type.
   *
   * This function will generate token related with the verification code.
   * It saves the verification code and token on the database.
   */
  async getResetCode(userId: string, email: string): Promise<string> {
    // get random 8 digit hexadecimal string
    const resetCode = randomBytes(4).toString('hex');

    // fetch secret code from .env file.
    const secret = this.config.get('JWT_SECRET');

    // a pload for generated token.
    const privateInfo = {
      sub: userId,
      resetCode: resetCode,
      email,
    };

    // generate token
    const token = await this.jwtService.signAsync(privateInfo, {
      expiresIn: '15m', // valid only for 15 minute.
      secret: secret,
    });

    // privateInfo['token'] = token;

    // encrypt the reset code to be registered at database.
    const hashedResetCode = await bcrypt.hash(resetCode, 10);

    // update the database with new v.code and token.
    await this.database.users.update({
      where: { id: privateInfo.sub },
      data: {
        verificationCode: hashedResetCode,
        token: token,
        // no updated at change here
      },
    });

    return resetCode;
  }

  /**
   *
   * @param token
   * @returns Object
   *
   * This function will return boolean value in the form of an Object.
   * It is true if and only if the provided token is not expired.
   */
  async isValidToken(token: string): Promise<Object> {
    try {
      // fetch the secret code from .env file
      const secret = this.config.get('JWT_SECRET');

      // decode the token.
      const decodedToken = await this.jwtService.verify(token, { secret: secret });

      // convert milliseconds to seconds.
      const now = Date.now() / 1000;

      // token not expired.
      if (decodedToken.exp > now) {
        return {
          isValid: true,
        };
      }
      // if token expiration time is less than now, token expired.
      throw new RequestTimeoutException('token expired');
    } catch (error) {
      throw new RequestTimeoutException('token expired');
    }
  }

  /**
   *
   * @param isVVC (it has email of user and verification code, a code is sent when forgot.)
   * @returns it returns boolean in the form of an object.
   */

  async isValidVerificationCode(isValidCode: IsValidCode): Promise<Object> {
    // fetch user info by its email.
    const user = await this.database.users.findUnique({
      where: { email: isValidCode.email },
    });

    if (!user) {
      throw new NotFoundException('user not found.');
    }

    const isMatch = await bcrypt.compare(isValidCode.code, user.verificationCode);
    if (isMatch) {
      try {
        // fetch the secret code from .env file
        const secret = this.config.get('JWT_SECRET');

        // decode the token.
        const decodedToken = await this.jwtService.verify(user.token, {
          secret: secret,
        });

        // convert milliseconds to seconds.
        const now = Date.now() / 1000;

        // token not expired.
        if (decodedToken.exp > now) {
          return {
            isValid: true,
            token: user.token,
          };
        }
      } catch (error) {
        // if token expiration time is less than now, token expired.
        throw new RequestTimeoutException('token expired');
      }
    } else {
      throw new NotAcceptableException('verification code incorrect');
    }
  }

  /**
   *
   * @param dtoRP (new password, token, email)
   * @returns Object
   *
   * This reset password function used to change the password.
   * After changing it will send an email to notice as the password is changed.
   */
  async resetPassword(dtoRP: ResetPasswordDto): Promise<Object> {
    // get token from database by email.
    const user = await this.database.users.findUnique({
      where: { email: dtoRP.email },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // check the the token, as it is valid.
    const isValidToken = await this.isValidToken(user.token);

    // if token is valid
    if (isValidToken) {
      // encrypt the new password with Advanced encryption system, with salt = 10;
      const hash = await bcrypt.hash(dtoRP.newPassword, 10);

      // update the user password by newly provided password.
      const user = await this.database.users.update({
        where: { email: dtoRP.email },
        data: {
          password: hash,
          updatedAt: new Date(),
        },
      });

      const fullName = user.firstName + ' ' + user.lastName;

      // tell the user via an email as his password is has been changed.
      await this.emailService.sendSecurityAlert(user.email, fullName);

      return {
        message: 'you have reset your password successfully',
      };
    } else {
      return new RequestTimeoutException('Your session have been expired!');
    }
  }

  /**
   *
   * @param dtoCP
   * @returns
   */
  async changePassword(dtoCP: ChangePassword): Promise<Object> {
    // try{
    // find user by email
    const getUser = await this.database.users.findUnique({
      where: { email: dtoCP.email },
    });

    if (!getUser) {
      return new NotFoundException('user not found');
    }

    // check if current password is correct?
    const isMuch = await bcrypt.compare(dtoCP.currentPassword, getUser.password);

    if (isMuch) {
      // encrypt new password to be registered.
      const hash = await bcrypt.hash(dtoCP.newPassword, 10);

      // update the current password with new password.
      const user = await this.database.users.update({
        where: {
          email: dtoCP.email, // email is unique, so we can!
        },
        data: {
          password: hash,
          updatedAt: new Date(),
        },
      });

      const fullName = user.firstName + ' ' + user.lastName;

      // tell the user via an email as his password is has been changed.
      await this.emailService.sendSecurityAlert(user.email, fullName);

      return {
        message: 'Password change successful.',
      };
    } else {
      throw new UnauthorizedException('current password not correct.');
    }
  }
}
