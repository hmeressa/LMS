import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { join } from 'path';

@Controller('app')
@ApiTags('app')
export class AppController {
  @Get('getLogo')
  findLogo(@Res() res: any) {
    const filepath = join(process.cwd(), 'templates', 'asset', 'images', 'IE_Networks_logo.png');
    res.sendFile(filepath);
  }
}
