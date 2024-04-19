import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Category } from '../../courseDto';
import { CategoryService } from './category.service';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtGuard, RolesGuard } from '../../../auth/guard';
import { Permissions } from '../../../auth/decorator';

@Controller('category')
@ApiTags('category')
@UseGuards(JwtGuard) // so as it will guard all APIs.
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // register
  @Post('registerOne')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_categories', 'add')
  async registerOne(@Body() category: Category): Promise<Object> {
    return this.categoryService.registerOne(category);
  }

  // get all category of courses.
  @Get('findAll')
  @UseGuards(RolesGuard)
  @Permissions('categories', 'view') 
  findAll(): Promise<Object> {
    return this.categoryService.findAll();
  }

  // find category by id
  @Get('findOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('categories', 'view')
  findOneById(@Param('id') id: string): Promise<Object> {
    return this.categoryService.findOneById(id);
  }

  // find category by its name
  @Get('findOneByName/:categoryName')
  @UseGuards(RolesGuard)
  @Permissions('categories', 'view')
  findOneByName(@Param('categoryName') categoryName: string): Promise<Object> {
    return this.categoryService.findOneByName(categoryName);
  }

  // update category
  @Put('updateOne/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_categories', 'edit')
  updateOne(@Param('id') categoryId: string, @Body() category: Category): Promise<Object> {
    return this.categoryService.updateOne(categoryId, category);
  }

  // delete category by its id. if it is not referenced
  @Delete('deleteOneById/:id')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_categories', 'delete')
  deleteOneById(@Param('id') id: string): Promise<Object> {
    return this.categoryService.deleteOneById(id);
  }

  // delete category using category name. if it is not referenced
  @Delete('deleteOneByName/:categoryName')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_categories', 'delete')
  deleteOneByName(@Param('categoryName') categoryName: string): Promise<Object> {
    return this.categoryService.deleteOneByName(categoryName);
  }

  // delete all categories. if it is not referenced
  @Delete('deleteAll')
  @UseGuards(RolesGuard)
  @Permissions('siteAdmin_categories', 'delete')
  deleteAll(): Promise<Object> {
    return this.categoryService.deleteAll();
  }
}
