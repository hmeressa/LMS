import { Body, Controller, Delete, Param, Post, Put, HttpCode, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Team } from '../../usermgtDto';
import { TeamsService } from './teams.service';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('team')
@ApiTags('team')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class TeamsController {
  constructor(private teamService: TeamsService) {}

  @Post('registerOne')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_teams', 'add')
  async registerOne(@Body() team: Team): Promise<Object> {
    return this.teamService.registerOne(team);
  }

  @Post('findAll')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Permissions('teams', 'view')
  findAll(): Promise<Object> {
    return this.teamService.findAll();
  }

  @Post('findOneById/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Permissions('teams', 'view')
  findOneById(@Param('id') id: string): Promise<Object> {
    return this.teamService.findOneById(id);
  }

  @Post('findOneByName/:teamName')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Permissions('teams', 'view')
  findOneByName(@Param('teamName') teamName: string): Promise<Object> {
    return this.teamService.findOneByName(teamName);
  }

  @Post('findTeamNameByEmail/:email')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RolesGuard)
  @Permissions('teams', 'view')
  findTeamNameByEmail(@Param('email') email: string): Promise<Object> {
    return this.teamService.findTeamNameByEmail(email);
  }

  @Put('updateOne/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_teams', 'edit')
  updateOne(@Param('id') teamId: string, @Body() team: Team): Promise<Object> {
    return this.teamService.updateOne(teamId, team);
  }

  @Delete('deleteOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_teams', 'delete')
  deleteOneById(@Param('id') id: string): Promise<Object> {
    return this.teamService.deleteOneById(id);
  }

  @Delete('deleteOneByName/:teamName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_teams', 'delete')
  deleteOneByName(@Param('teamName') teamName: string): Promise<Object> {
    return this.teamService.deleteOneByName(teamName);
  }

  @Delete('deleteAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_teams', 'delete')
  deleteAll(): Promise<Object> {
    return this.teamService.deleteAll();
  }
}
