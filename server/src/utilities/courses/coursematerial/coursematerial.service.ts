import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseMaterials } from '../../../utilities/courseDto';
import * as fs from 'fs-extra';

@Injectable()
export class CoursematerialService {
  constructor(private database: PrismaService) {}

  /**
   * Register course material method.
   */

  async register(courseTitle: string, courseMaterial: CourseMaterials): Promise<Object> {
    // check if course title is not given.
    if (!courseTitle) {
      throw new NotAcceptableException('Course title is required.');
    }

    // check for the given course title.
    const course = await this.database.course.findUnique({
      where: { title: courseTitle },
    });

    // if their is no course
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // check the uniqueness of the title.
    const courseMtl = await this.database.courseMaterials.findUnique({
      where: { title: courseMaterial.title },
      // where: {
      //   title_courseId: {
      //     title: courseMaterial.title,
      //     courseId: course.id,
      //   },
      // },
    });
    if (courseMtl) {
      throw new NotAcceptableException('The title of course-material must be unique.');
    }
    // create new course material.
    await this.database.courseMaterials.create({
      data: {
        title: courseMaterial.title,
        crhr: courseMaterial.crhr,
        body: courseMaterial.body,
        courseId: course.id,
      },
    });
    return { message: 'material for specific course added successfully.' };
  }

  /**
   * Find all course materials under one course.
   * This may help us at admin side for further analysis.
   */

  async findManyByCourseTitle(courseTitle: string): Promise<Object> {
    // if courseTitle is not provided.
    if (!courseTitle) {
      throw new NotAcceptableException('courseTitle required');
    }

    // check the validity of the courseTitle.
    const course = await this.database.course.findUnique({
      where: { title: courseTitle },
    });

    if (!course) {
      throw new NotFoundException('course identified by this title is not found');
    }

    const courseMaterial = await this.database.courseMaterials.findMany({
      where: { courseId: course.id },
      include: {
        files: {
          select: {
            id: true,
            // fieldname: true,
            originalname: true,
            // encoding: true,
            mimetype: true,
            // destination: true,
            filename: true,
            // path: true,
            size: true,
            tunnel: true,
          },
        },
      },
    });
    return courseMaterial;
  }

  /**
   *
   * @param courseMaterialTitle
   * @param fieldname
   * @param originalname
   * @param encoding
   * @param mimetype
   * @param destination
   * @param filename
   * @param filepath
   * @param size
   * @returns
   * This method will upload a file under specific course material.
   */
  async uploadFile(
    courseMaterialTitle: string,
    tunnel: string,
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    filepath: string,
    size: number,
  ): Promise<Object> {
    // if course material title is not provided.
    if (!courseMaterialTitle) {
      fs.remove(filepath);
      throw new NotAcceptableException('courseMaterialTitle required.');
    }

    // check the validity of given title.
    const material = await this.database.courseMaterials.findUnique({
      where: { title: courseMaterialTitle },
    });

    // if material not found.
    if (!material) {
      fs.remove(filepath);
      throw new NotFoundException('material not found');
    }
    const file = fs.readFile(filepath); 
    if (file) {
      await this.database.file.create({
        data: {
          fieldname: fieldname,
          originalname: originalname,
          encoding: encoding,
          mimetype: mimetype,
          destination: destination,
          filename: filename,
          path: filepath,
          size: size,
          tunnel: tunnel,
          courseMaterialId: material.id,
        },
      });
      return { message: 'New file uploaded for this material.' };
    }
    throw new NotAcceptableException('create uploading directory. Hint: restart the system.');
  }

  async findOneFilenameById(fileId: string) {
    if (!fileId) {
      throw new NotAcceptableException('Id of file is required.');
    }

    // check for the given file existence.
    const file = await this.database.file.findUnique({
      where: { id: fileId },
    });

    // if their is no file identified by the given id.
    if (!file) {
      throw new NotFoundException('No such file to delete.');
    }
    // success.
    return file.filename;
  }

  async findOneFilenameByIdForAllTypeOfFile(fileId: string) {
    if (!fileId) {
      throw new NotAcceptableException('Id of file is required.');
    }

    // check for the given file existence.
    const file = await this.database.file.findUnique({
      where: { id: fileId },
    });

    // if their is no file identified by the given id.
    if (!file) {
      throw new NotFoundException('No such file to delete.');
    }
    // success.
    return file;
  }

  /**
   *
   * @param courseMaterialTitle
   * @returns
   * This method deletes specific material within its file.
   */
  async deleteOneByTitle(courseMaterialTitle: string) {
    // check, if title of course material is not given.
    if (!courseMaterialTitle) {
      throw new NotAcceptableException('Title of course material is required.');
    }

    // check for the given course title.
    const courseMaterial = await this.database.courseMaterials.findUnique({
      where: { title: courseMaterialTitle },
    });

    // if their is no material identified by the given title.
    if (!courseMaterial) {
      throw new NotFoundException('Title of course material is not found');
    }

    // delete the material. then if there is related file, it will be deleted by [onDelete: Cascade] feature of prisma.
    await this.database.courseMaterials.delete({
      where: { id: courseMaterial.id },
    });

    // success.
    return { message: 'You have deleted the Course material, successfully.' };
  }

  async deleteOneFileById(fileId: string) {
    // check, if Id of file is not given.
    if (!fileId) {
      throw new NotAcceptableException('Id of file is required.');
    }

    // check for the given file existence.
    const file = await this.database.file.findUnique({
      where: { id: fileId },
    });

    // if their is no file identified by the given id.
    if (!file) {
      throw new NotFoundException('No such file to delete.');
    }

    // delete the material. then if there is related file, it will be deleted by [onDelete: Cascade] feature of prisma.
    await this.database.file.delete({
      where: { id: fileId },
    });

    // success.
    return { message: 'You have deleted the file, successfully.' };
  }
}
