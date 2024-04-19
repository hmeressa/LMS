import { Body, Controller, Delete, Param, Post, Put, Patch, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PositionChange, RoleName, TeamName, Users, UsersUpdate } from '../../usermgtDto';
import { UserService } from './user.service';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('user')
@ApiTags('user')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  // * register one user ones.
  @Post('register')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'add')
  async registerUser(@Body() user: Users): Promise<Object> {
    return this.userService.registerUser(user);
  }

  // * find all users once
  @Post('findAll')
  @UseGuards(RolesGuard)
  @Permissions('users', 'view')
  @HttpCode(HttpStatus.OK)
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  // * find one user by its id.
  @Post('findOneById/:userId')
  @UseGuards(RolesGuard)
  @Permissions('users', 'view')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('userId') id: string) {
    return this.userService.findOneById(id);
  }

  // * find one user by its email with its role.
  @Post('findOneByEmail/:email')
  @UseGuards(RolesGuard)
  @Permissions('users', 'view')
  @HttpCode(HttpStatus.OK)
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  // * find one user by its email without its role.
  @Post('findOneByEmailWithoutRoleAndTeam/:email')
  @UseGuards(RolesGuard)
  @Permissions('users', 'view')
  @HttpCode(HttpStatus.OK)
  findOneByEmailWithoutRole(@Param('email') email: string) {
    return this.userService.findOneByEmailWithoutRole(email);
  }

  @Put('updateOne/:id')
  @UseGuards(RolesGuard)
  @Permissions('settings', 'edit')
  updateOne(@Param('id') id: string, @Body() user: UsersUpdate) {
    return this.userService.updateOne(id, user);
  }

  @Patch('changePosition/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'edit')
  positionChange(@Param('id') id: string, @Body() position: PositionChange) {
    return this.userService.positionChange(id, position);
  }

  @Patch('teamChange/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'edit')
  teamChange(@Param('id') id: string, @Body() teamName: TeamName) {
    return this.userService.teamChange(id, teamName);
  }

  @Patch('roleChange/:userId')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'edit')
  roleChange(@Param('userId') id: string, @Body() roleName: RoleName) {
    return this.userService.roleChange(id, roleName);
  }

  // ! delete one user by its id.
  @Delete('deleteAdminById/:userId')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'delete')
  deleteOneById(@Param('userId') userId: string) {
    return this.userService.deleteOneById(userId);
  }

  // ! delete one user by its email.
  @Delete('deleteAdminByEmail/:email')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_users', 'delete')
  deleteOneByEmail(@Param('email') email: string) {
    return this.userService.deleteOneByEmail(email);
  }
}
