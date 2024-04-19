import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Res,
  StreamableFile,
  Post,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursematerialService } from './coursematerial.service';
import { CourseMaterials } from '../../../utilities/courseDto/course-materials.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 
import * as path from 'path';
import { join } from 'path';
import * as fs from 'fs-extra';
import * as mime from 'mime-types';
import { createReadStream } from 'fs';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('coursematerial')
@ApiTags('Course Material')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class CoursematerialController {
  constructor(private courseMaterialService: CoursematerialService) {}

  @Post('register/:courseTitle')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'add')
  async register(@Param('courseTitle') courseTitle: string, @Body() courseMaterial: CourseMaterials) {
    return this.courseMaterialService.register(courseTitle, courseMaterial);
  }

  @Get('findManyByCourseTitle/:courseTitle')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  findManyByCourseTitle(@Param('courseTitle') courseTitle: string) {
    return this.courseMaterialService.findManyByCourseTitle(courseTitle);
  }

  @Post('uploadFile/:courseMaterialTitle/:tunnel')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'add')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/courseMaterials',
        // TODO: make dynamic directory for the uploaded materials per their course category.
        // destination: async (req, file, cb) => {
        //   const courseTitle = req.params.courseTitle;
        //   // TODO: Include category for the path.
        //   // const category = await this.courseMaterialService.getCategory();
        //   const directoryPath = `uploads/courses/${courseTitle}`;
        //   // create directory.
        //   fs.mkdir(directoryPath, { recursive: true }, (err) => {
        //     if (err) {
        //       throw new InternalServerErrorException('Error while uploading a file.');
        //     }
        //   });
        //   const destination = `uploads/courses/${courseTitle}`;
        //   cb(null, destination);
        // },
        filename: (req, file, cb) => {
          // this generates unique name for all file.
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload files under specific course material',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @Param('courseMaterialTitle') courseMaterialTitle: string,
    @Param('tunnel') tunnel: string,
    @UploadedFile() file: Express.Multer.File, // * It can accept any type of files with any size, no filtration.
  ) {
    let fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      destination: string,
      filename: string,
      filepath: string,
      size: number;
    if (file) {
      // I'm taking all the new uploaded property of the file.
      fieldname = file.fieldname;
      originalname = file.originalname;
      encoding = file.encoding;
      mimetype = file.mimetype;
      destination = file.destination;
      filename = file.filename;
      filepath = file.path;
      size = file.size;
    }
    return this.courseMaterialService.uploadFile(
      courseMaterialTitle,
      tunnel,
      fieldname,
      originalname,
      encoding,
      mimetype,
      destination,
      filename,
      filepath,
      size,
    );
  }

  @Get('findOneFileById/:fileId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  async findOneFileById(@Param('fileId') fileId: string, @Res() res: any): Promise<any> {
    const getFilename = await this.courseMaterialService.findOneFilenameByIdForAllTypeOfFile(fileId);
    const filepath = join(process.cwd(), 'uploads', 'courseMaterials', getFilename.filename);
    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const contentType = mime.lookup(filepath);
  
    const head = {
      'Content-Type': contentType,
      'Content-Length': fileSize,
      'Content-Desposition': `attachment; filename=${getFilename}`,
    };
  
    res.writeHead(200, head);
  
    const fileStream = fs.createReadStream(filepath, { highWaterMark: 1024 * 1024 }); // 1MB chunk size
    let totalBytesSent = 0;
  
    fileStream.on('data', (chunk) => {
      totalBytesSent += chunk.length;
      // console.log('sent chunk: ', chunk.length, 'bytes' )
      res.write(chunk);
    });
  
    fileStream.on('end', () => {
      // console.log(`Sent ${totalBytesSent} bytes total`);
      res.end();
    });
  
    fileStream.on('error', (error) => {
      // console.error(`Error streaming file: ${error}`);
      res.end();
    });
  }

  @Get('downloadFileById/:fileId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'view')
  async getStaticFile(@Param('fileId') fileId: string): Promise<StreamableFile> {
    const getFilename = await this.courseMaterialService.findOneFilenameById(fileId);
    const file = fs.createReadStream(join(process.cwd(), 'uploads', 'courseMaterials', getFilename));
    return new StreamableFile(file);
  }

  // delete one material, with its related file.
  @Delete('deleteOneByTitle/:courseMaterialTitle')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'delete')
  deleteOneByTitle(@Param('courseMaterialTitle') courseMaterialTitle: string) {
    return this.courseMaterialService.deleteOneByTitle(courseMaterialTitle);
  }

  // delete one file by its id.
  @Delete('deleteOneFileById/:fileId')
  @UseGuards(RolesGuard)  
  @Permissions('allCourses', 'delete')
  deleteOneFileById(@Param('fileId') fileId: string) {
    return this.courseMaterialService.deleteOneFileById(fileId);
  }
}
