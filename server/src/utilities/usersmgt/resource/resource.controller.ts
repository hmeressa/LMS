import { Controller, Param, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResourceService } from './resource.service';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('resource')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
@ApiTags('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post('findAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_privileges', 'view')
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Object> {
    return this.resourceService.findAll();
  }

  @Post('findOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_privileges', 'view')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id') id: string): Promise<Object> {
    return this.resourceService.findOneById(id);
  }

  @Post('findOneByName/:resourceName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_privileges', 'view')
  @HttpCode(HttpStatus.OK)
  findOneByName(@Param('resourceName') resourceName: string): Promise<Object> {
    return this.resourceService.findOneByName(resourceName);
  }
}
