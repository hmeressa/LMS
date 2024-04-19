import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  async onModuleInit() {
    try {
      const adminEmail = 'user.admin@test.com';
      const memberEmail = 'user.member@test.com';

      const adminReady = await this.prisma.users.findMany();
      if (adminReady.length == 0) {
        // if no data inside the database?
        // create team that guards all teams inside company.
        const teamAll = await this.prisma.team.create({
          data: {
            teamName: 'All',
            description: 'This team is a shelter for all teams inside the IE Networks',
          },
        });
        const teamSaas = await this.prisma.team.create({
          data: {
            teamName: 'SaaS',
            description: 'Sample team for testing purposes',
          },
        });

        const resourceData = [
          {
            resourceName: 'allCourses',
            description: 'All course will be all courses taken under the company.',
          },
          {
            resourceName: 'dashboard',
            description: 'Dashboard is where we display user activity',
          },
          {
            resourceName: 'siteAdmin_dashboard',
            description: 'Dashboard is where we display data for the admin',
          },
          {
            resourceName: 'users',
          },
          {
            resourceName: 'teams',
          },
          {
            resourceName: 'categories',
          },
          {
            resourceName: 'settings',
            description: 'Settings are were we manage our profile, system appearance and other settings.',
          },
          {
            resourceName: 'siteAdmin_announcements',
          },
          {
            resourceName: 'comment',
          },
          {
            resourceName: 'siteAdmin_users',
          },
          {
            resourceName: 'siteAdmin_teams',
          },
          {
            resourceName: 'siteAdmin_courses',
          },
          {
            resourceName: 'siteAdmin_roles',
          },
          {
            resourceName: 'siteAdmin_privileges',
          },
          {
            resourceName: 'siteAdmin_categories',
          },
        ];

        // create all resource as a one.
        await this.prisma.resource.createMany({
          data: resourceData,
        });

        // create role for an admin
        const superAdminRole = await this.prisma.role.create({
          data: {
            roleName: 'SuperAdmin',
            description:
              'superAdmin is an admin who can create other admins, managers ... by giving specified role to them.',
          },
        });
        const memberRole = await this.prisma.role.create({
          data: {
            roleName: 'member',
            description: 'user of the system',
          },
        });

        const createdResource = await this.prisma.resource.findMany();

        // Create privileges for the admin
        for (let i = 0; i < createdResource.length; i++) {
          await this.prisma.privilege.create({
            data: {
              view: true,
              add: true,
              edit: true,
              delete: true,
              roleId: superAdminRole.id,
              resourceId: createdResource[i].id,
            },
          });
        }
        // Create privileges for member
        for (let i = 0; i < createdResource.length; i++) {
          await this.prisma.privilege.create({
            data: {
              // set false to admin related roles
              view: !createdResource[i].resourceName.includes('siteAdmin'),
              add: !createdResource[i].resourceName.includes('siteAdmin'),
              edit: !createdResource[i].resourceName.includes('siteAdmin'),
              delete: !createdResource[i].resourceName.includes('siteAdmin'),
              roleId: memberRole.id,
              resourceId: createdResource[i].id,
            },
          });
        }

        // set default passwords for the users
        const adminPassword = 'user.admin';
        const memberPassword = 'user.member';
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
        const hashedMemberPassword = await bcrypt.hash(memberPassword, 10);

        // create a superAdmin.
        const superAdmin = await this.prisma.users.create({
          data: {
            firstName: 'Super',
            lastName: 'Admin',
            email: adminEmail,
            password: hashedAdminPassword,
            position: 'SUPER ADMIN',
            gender: 'MALE',
            roleId: superAdminRole.id,
            teamId: teamAll.id,
          },
        });
        // create a member.
        const member = await this.prisma.users.create({
          data: {
            firstName: 'Test',
            lastName: 'User',
            email: memberEmail,
            password: hashedMemberPassword,
            position: 'MEMBER',
            gender: 'MALE',
            roleId: memberRole.id,
            teamId: teamSaas.id,
          },
        });
        console.log('Admin email: ', superAdmin.email, 'Admin password: ', adminPassword);
        console.log('Member email: ', member.email, 'Member password: ', memberPassword);
        console.log('Seed completed!');
      } else {
        console.log('Already seeded...');
      }
    } catch (error) {
      console.error('seeding error: ', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
