import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Privilege, Role } from '../../usermgtDto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private database: PrismaService) {}

  // register single role once.
  async registerOne(role: Role): Promise<Object> {
    // check if role name is pre registered.
    const preRegistered = await this.database.role.findUnique({
      where: { roleName: role.roleName },
    });

    // if not registered
    if (preRegistered) {
      throw new NotAcceptableException('role name must be unique.');
    }

    const newRole = await this.database.role.create({
      data: {
        roleName: role.roleName,
        description: role.description,
      },
    });

    const systemResource = await this.database.resource.findMany();
    // The default permissions of allCourse, dashboard, users, teams,
    // and categories for any role without super admin is view only.
    for (let i = 0; i < 5; i++) {
      await this.database.privilege.create({
        data: {
          view: true,
          add: false,
          edit: false,
          delete: false,
          roleId: newRole.id,
          resourceId: systemResource[i].id,
        },
      });
    }

    // All default permissions of settings, siteAdmin_announcements, and comment
    // are true for all roles.
    for (let i = 5; i < 8; i++) {
      await this.database.privilege.create({
        data: {
          view: true,
          add: true,
          edit: true,
          delete: true,
          roleId: newRole.id,
          resourceId: systemResource[i].id,
        },
      });
    }

    // All default permissions of siteAdmin_courses, siteAdmin_users, siteAdmin_teams, siteAdmin_roles, and siteAdmin_privileges
    // are false for all roles without super amin.
    for (let i = 8; i < 14; i++) {
      await this.database.privilege.create({
        data: {
          view: false,
          add: false,
          edit: false,
          delete: false,
          roleId: newRole.id,
          resourceId: systemResource[i].id,
        },
      });
    }

    // return success message.
    return { message: 'role created successfully.' };
  }

  // fetch all role once
  async findAll() {
    //    read all
    const allRole = await this.database.role.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        privileges: {
          select: {
            id: true,
            view: true,
            add: true,
            edit: true,
            delete: true,
            createdAt: true,
            updatedAt: true,
            resource: true,
          },
        },
      },
    });

    // splice the super admin role.
    const roles = allRole.splice(1, allRole.length);
    return roles;
  }

  // find one role by its id
  async findOneById(id: string): Promise<Object> {
    // find one role by its id.
    const role = await this.database.role.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        privileges: {
          select: {
            id: true,
            view: true,
            add: true,
            edit: true,
            delete: true,
            createdAt: true,
            updatedAt: true,
            resource: true,
          },
        },
      },
    });
    if (!role) {
      throw new NotFoundException('role not found.');
    }
    return role;
  }

  // find one role by its name.
  async findOneByName(roleName: string) {
    // find one role by its role name.
    const role = await this.database.role.findUnique({
      where: { roleName },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true,
            phone: true,
            gender: true,
            createdAt: true,
            updatedAt: true,
            lastLoggedIn: true,
            status: true,
          },
        },
        privileges: {
          select: {
            id: true,
            view: true,
            add: true,
            edit: true,
            delete: true,
            createdAt: true,
            updatedAt: true,
            resource: true,
          },
        },
      },
    });
    if (!role) {
      throw new NotFoundException('role not found.');
    }
    return role;
  }

  // update one role by its id.
  async updateOne(roleId: string, role: Role) {
    // if role id is missed.
    if (!roleId) {
      throw new NotAcceptableException('role id is missing.');
    }

    // find the role by the given id.
    const res = await this.database.role.findUnique({
      where: { id: roleId },
    });

    // if not found.
    if (!res) {
      throw new NotFoundException('role not found.');
    }

    // if this two role names are not equal I have to check the uniqueness of the given role name.
    if (role.roleName != res.roleName) {
      const temp = await this.database.role.findUnique({
        where: { roleName: role.roleName },
      });
      // not other name that match with the given role name.
      if (!temp) {
        const updatedRole = await this.database.role.update({
          where: { id: roleId },
          data: {
            roleName: role.roleName,
            description: role.description,
          },
        });

        // if not updated well, this is may be internal server error.
        if (!updatedRole) {
          throw new InternalServerErrorException('Internal server error while updating.');
        }
      } else {
        throw new NotAcceptableException('role name must be unique.');
      }
    } else {
      const updatedRole = await this.database.role.update({
        where: { id: roleId },
        data: {
          roleName: role.roleName,
          description: role.description,
        },
      });
      // if not updated well, this is may be internal server error.
      if (!updatedRole) {
        throw new InternalServerErrorException('Internal server error while updating.');
      }
    }
    // success.
    return { message: 'your role has been updated successfully.' };
  }

  // update all privileges of one role once.
  async updatePrivileges(privileges: Privilege[]) {
    for (let i = 0; i < privileges.length; i++) {
      try {
        await this.database.privilege.update({
          where: { id: privileges[i].id },
          data: {
            view: privileges[i].view,
            add: privileges[i].add,
            edit: privileges[i].edit,
            delete: privileges[i].delete,
          },
        });
      } catch (err) {
        throw new NotAcceptableException('error happened at id: ' + privileges[i].id);
      }
    }
    // success.
    return { message: 'Role has been updated successfully.' };
  }

  // delete one role once, by its id.
  async deleteOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id is required');
    }

    // find role
    const res = await this.database.role.findUnique({
      where: { id },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('role not found exception.');
    }

    try {
      // delete the role.
      const deletedRes = await this.database.role.delete({
        where: { id },
      });
      if (!deletedRes) {
        throw new NotFoundException('role not found');
      }
      return { message: 'role has been deleted successfully.' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // delete one role once, by its id.
  async deleteOneByName(roleName: string): Promise<Object> {
    if (!roleName) {
      throw new NotAcceptableException('role name missing.');
    }

    // find role
    const res = await this.database.role.findUnique({
      where: { roleName },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('role not found exception.');
    }

    try {
      // delete the role.
      await this.database.role.delete({
        where: { roleName },
      });

      return { message: 'role has been deleted successfully.' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  // delete all role once.
  async deleteAll() {
    // find role
    const res = await this.database.role.findMany();

    // if not found
    if (res.length == 0) {
      throw new NotFoundException('role not found exception.');
    }

    try {
      // delete roles
      await this.database.role.deleteMany();

      // return success message
      return { message: 'role has been deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
