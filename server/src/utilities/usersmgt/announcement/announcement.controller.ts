import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Announcement } from '../../usermgtDto';
import { AnnouncementService } from './announcement.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('announcement')
@ApiTags('announcement')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class AnnouncementController {
  constructor(private announcementService: AnnouncementService) {}

  @Post('registerOne/:email')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'add')
  async registerOne(@Param('email') email: string, @Body() announcement: Announcement): Promise<Object> {
    return this.announcementService.registerOne(email, announcement);
  }

  @Get('findAllPublicAnnouncements')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  findAll(): Promise<Object> {
    return this.announcementService.findAll();
  }

  @Post('findManyByEmail/:email')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  @HttpCode(HttpStatus.OK)
  findManyByEmail(@Param('email') email: string): Promise<Object> {
    return this.announcementService.findManyByEmail(email);
  }
  @Post('findManyAnnouncementSentForMe/:email')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  @HttpCode(HttpStatus.OK)
  findManyAnnounceSentForMe(@Param('email') email: string): Promise<Object> {
    return this.announcementService.findManyAnnouncementSentForMe(email);
  }

  @Post('findOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id') id: string): Promise<Object> {
    return this.announcementService.findOneById(id);
  }

  @Post('createReadHistory/:announcementId/:email')
  createReadHistory(@Param('announcementId') announcementId: string, @Param('email') email: string): Promise<Object> {
    return this.announcementService.createReadHistory(announcementId, email);
  }

  @Post('usersRead/:announcementId')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  @HttpCode(HttpStatus.OK)
  usersReadOne(@Param('announcementId') announcementId: string) {
    return this.announcementService.usersReadOne(announcementId);
  }

  @Post('findManyByTeamName/:teamName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'view')
  @HttpCode(HttpStatus.OK)
  findManyByTeamName(@Param('teamName') teamName: string) {
    return this.announcementService.findManyByTeamName(teamName);
  }

  @Put('updateOne/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'edit')
  updateOne(@Param('id') announcementId: string, @Body() announcement: Announcement): Promise<Object> {
    return this.announcementService.updateOne(announcementId, announcement);
  }

  @Delete('deleteOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'delete')
  deleteOneById(@Param('id') id: string): Promise<Object> {
    return this.announcementService.deleteOneById(id);
  }

  @Delete('deleteManyByTeamName/:teamName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'delete')
  deleteManyByTeamName(@Param('teamName') teamName: string) {
    return this.announcementService.deleteManyByTeamName(teamName);
  }

  @Delete('deleteAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_announcements', 'delete')
  deleteAll(): Promise<Object> {
    return this.announcementService.deleteAll();
  }
}
