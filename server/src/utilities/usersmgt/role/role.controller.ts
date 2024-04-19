import { Body, Controller, Delete, Param, Post, Put, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Privilege, Role } from '../../usermgtDto';
import { RoleService } from './role.service';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('role')
@UseGuards(JwtGuard) // So as it will guard all APIs.
@ApiBearerAuth()
@ApiTags('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post('registerOne')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'add')
  registerOne(@Body() role: Role): Promise<Object> {
    return this.roleService.registerOne(role);
  }

  @Post('findAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'view')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Object> {
    return this.roleService.findAll();
  }

  @Post('findOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'view')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id') id: string): Promise<Object> {
    return this.roleService.findOneById(id);
  }

  @Post('findOneByName/:roleName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'view')
  @HttpCode(HttpStatus.OK)
  findOneByName(@Param('roleName') roleName: string): Promise<Object> {
    return this.roleService.findOneByName(roleName);
  }

  @Put('updateOne/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'edit')
  updateOne(@Param('id') roleId: string, @Body() role: Role): Promise<Object> {
    return this.roleService.updateOne(roleId, role);
  }

  @Put('updatePrivileges')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_privileges', 'edit')
  updatePrivileges(@Body() privileges: Privilege[]): Promise<Object> {
    return this.roleService.updatePrivileges(privileges);
  }

  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'delete')
  @Delete('deleteOneById/:id')
  deleteOneById(@Param('id') id: string): Promise<Object> {
    return this.roleService.deleteOneById(id);
  }

  @Delete('deleteOneByName/:roleName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'delete')
  deleteOneByName(@Param('roleName') roleName: string): Promise<Object> {
    return this.roleService.deleteOneByName(roleName);
  }

  @Delete('deleteAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_roles', 'delete')
  deleteAll(): Promise<Object> {
    return this.roleService.deleteAll();
  }
}
