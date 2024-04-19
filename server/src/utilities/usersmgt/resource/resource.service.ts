import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
// import { Resource } from '../../usermgtDto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ResourceService {
  constructor(private database: PrismaService) {}

  // fetch all resource once
  async findAll() {
    //    read all
    const allResource = await this.database.resource.findMany({
      include: { privileges: true },
    });
    return allResource;
  }

  // find one resource by its id
  async findOneById(id: string): Promise<Object> {
    // find one resource by its id.
    const resource = await this.database.resource.findUnique({
      where: { id },
      include: { privileges: true },
    });
    if (!resource) {
      throw new NotFoundException('resource not found.');
    }
    return resource;
  }

  // find one resource by its name.
  async findOneByName(resourceName: string) {
    // find one resource by its resource name.
    const resource = await this.database.resource.findUnique({
      where: { resourceName },
      include: { privileges: true },
    });
    if (!resource) {
      throw new NotFoundException('resource not found.');
    }
    return resource;
  }
}
