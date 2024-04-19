import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; 
import { UserModule } from './user/user.module';
import { JwtStrategy } from '../../auth/strategy';
import { ResourceModule } from './resource/resource.module';
import { RoleModule } from './role/role.module';
import { TeamsModule } from './teams/teams.module';
import { ProfileimgModule } from './avatar/avatar.module';
import { AnnouncementModule } from './announcement/announcement.module';

@Module({
  imports: [ 
    ResourceModule,
    RoleModule,
    TeamsModule,
    UserModule,
    JwtModule.register({}),
    ProfileimgModule,
    AnnouncementModule,
  ],
  providers: [JwtStrategy],
})
export class UsersModule {}
