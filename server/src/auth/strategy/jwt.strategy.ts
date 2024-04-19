import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

// validating an access token.
@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt', // we can assign what we want  'jwt' is default
) {
  constructor(config: ConfigService, private database: PrismaService) {
    super({
      // we can extract the token from authHearer.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }
  async validate(payload: { sub: string; email: string }) {
    const user = await this.database.users.findUnique({
      where: {
        id: payload.sub,
      },
      include: {
        role: {
          select: {
            roleName: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            privileges: {
              select: {
                id: true,
                view: true,
                add: true,
                edit: true,
                delete: true,
                createdAt: true,
                updatedAt: true,
                resource: {
                  select: {
                    resourceName: true,
                  },
                },
              },
            },
          },
        },
        team: {
          select: {
            teamName: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (user) {
      let privileges = {};
      for (let i = 0; i < user.role.privileges.length; i++) {
        const privilege = user.role.privileges[i];

        if (privilege.resource) {
          const privilegeName = privilege.resource.resourceName;
          privileges[privilegeName] = {
            id: privilege.id,
            view: privilege.view,
            add: privilege.add,
            edit: privilege.edit,
            delete: privilege.delete,
            createdAt: privilege.createdAt,
            updatedAt: privilege.updatedAt,
          };
          delete privilege.id;
          delete privilege.view;
          delete privilege.add;
          delete privilege.edit;
          delete privilege.delete;
          delete privilege.createdAt;
          delete privilege.updatedAt;
          delete privilege.resource;
        }
      }
      delete user.role.privileges;
      user.role['permissions'] = privileges;
      delete user.password;
      delete user.verificationCode;
      delete user.profileImge;
    }
    return user;
  }
}
