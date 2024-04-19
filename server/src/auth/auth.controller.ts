import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto, ChangePassword, ForgotPasswordEmail, IsValidCode, ResetPasswordDto } from './dto';
import { AuthService } from './auth.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { Users } from '../utilities/usermgtDto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard) // so as it will guard all APIs.
  @ApiBearerAuth()
  @Post('getme')
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: Users) {
    return user;
  }

  @Post('signin')
  @HttpCode(HttpStatus.ACCEPTED)
  async signin(@Body() dto: AuthDto): Promise<Object> {
    return this.authService.signin(dto);
  }

  @Post('forgotPassword')
  @HttpCode(HttpStatus.ACCEPTED)
  async forgotPassword(@Body() dtoFPE: ForgotPasswordEmail): Promise<Object> {
    return this.authService.forgotPassword(dtoFPE);
  }

  @Post('isValidCode')
  @HttpCode(HttpStatus.ACCEPTED)
  async isValidVerificationCode(@Body() isVC: IsValidCode) {
    return this.authService.isValidVerificationCode(isVC);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('resetPassword')
  async resetPassword(@Body() dtoRP: ResetPasswordDto): Promise<Object> {
    return this.authService.resetPassword(dtoRP);
  }

  // patch is used to update part of entity at a resource.
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch('changePassword')
  async changePassword(@Body() dtoCP: ChangePassword): Promise<Object> {
    return this.authService.changePassword(dtoCP);
  }
}
