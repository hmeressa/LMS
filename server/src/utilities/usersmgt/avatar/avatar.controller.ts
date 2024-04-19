import {
  Controller,
  UseInterceptors,
  UploadedFile,
  Param,
  HttpStatus,
  ParseFilePipeBuilder,
  Delete,
  Patch,
  Get,
  StreamableFile,
  Res,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProfileImageService } from './avatar.service';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('avatar')
@ApiTags('avatar')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProfileimgController {
  constructor(private readonly profileImageService: ProfileImageService) {}

  @Patch('update/:email')
  @UseGuards(RolesGuard)
  @Permissions('settings', 'edit')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'uploads/avatar',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Drag user profile image here',
    type: 'formData',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @Param('email') email: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg|jpg|png|svg|gif', // it only accepts those extention of files.
        })
        .addMaxSizeValidator({
          maxSize: 2000000, // 2MB picture, is a max size.
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<Object> {
    return this.profileImageService.profileImageChange(email, file.filename);
  }

  @Get('getAvatar/:email')
  @UseGuards(RolesGuard)
  @Permissions('settings', 'view')
  async serveAvatar(@Param('email') email: string, @Res() res: any): Promise<any> {
    try {
      const getFilename = await this.profileImageService.findAvatarName(email);
      const filepath = join(process.cwd(), 'uploads', 'avatar', getFilename);
      res.sendFile(filepath);
    } catch (e) {
      throw new InternalServerErrorException('image not found.');
    }
  }

  @Get('downloadAvatar/:email')
  @UseGuards(RolesGuard)
  @Permissions('settings', 'view')
  async getStaticFile(@Param('email') email: string): Promise<StreamableFile> {
    try {
      const avatarpath = await this.profileImageService.findAvatarName(email);
      const file = createReadStream(join(process.cwd(), 'uploads', 'avatar', avatarpath));
      return new StreamableFile(file);
    } catch (e) {
      throw new InternalServerErrorException('image not found.');
    }
  }

  @UseGuards(RolesGuard)
  @Delete('delete/:email')
  @Permissions('settings', 'delete')
  deleteAvatar(@Param('email') email: string) {
    try {
      return this.profileImageService.deleteAvatar(email);
    } catch (e) {
      throw new InternalServerErrorException('image not found.');
    }
  }
}
