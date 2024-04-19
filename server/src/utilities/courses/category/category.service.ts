import { Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { Category } from '../../courseDto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CourseService } from '../course/course.service';

@Injectable()
export class CategoryService {
  constructor(private database: PrismaService, private courseService: CourseService) {}

  // register single category once.
  async registerOne(category: Category): Promise<Object> {
    // check if category name is pre registered.
    const preRegistered = await this.database.category.findUnique({
      where: { categoryName: category.categoryName },
    });

    // if not registered
    if (!preRegistered) {
      await this.database.category.create({
        data: {
          categoryName: category.categoryName,
          description: category.description,
        },
      });
      // return success message.
      return { message: 'category created successfully.' };
    } else {
      throw new NotAcceptableException('category name must be unique.');
    }
  }

  // fetch all category once
  async findAll() {
    //    read all
    const allCategory = await this.database.category.findMany({
      include: { course: true },
    });

    for (let i = 0; i < allCategory.length; i++) {
      for (let j = 0; j < allCategory[i].course.length; j++) {
        allCategory[i].course[j]['progress'] = await this.courseService.findSingleCourseProgress(
          allCategory[i].course[j].id,
        );
      }
    }
    return allCategory;
  }

  // find one category by its id
  async findOneById(id: string): Promise<Object> {
    // find one category by its id.
    const category = await this.database.category.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!category) {
      throw new NotFoundException('category not found.');
    }
    return category;
  }

  // find one category by its name.
  async findOneByName(categoryName: string) {
    // find one category by its category name.
    const category = await this.database.category.findUnique({
      where: { categoryName },
      include: { course: true },
    });
    if (!category) {
      throw new NotFoundException('category not found.');
    }
    return category;
  }

  // update one category by its id.
  async updateOne(categoryId: string, category: Category) {
    // if category id is missed.
    if (!categoryId) {
      throw new NotAcceptableException('category id is missing.');
    }

    // find the category by the given id.
    const res = await this.database.category.findUnique({
      where: { id: categoryId },
    });

    // if not found.
    if (!res) {
      throw new NotFoundException('category not found.');
    }

    // if this two category names are not equal I have to check the uniqueness of the given category name.
    if (category.categoryName != res.categoryName) {
      const temp = await this.database.category.findUnique({
        where: { categoryName: category.categoryName },
      });
      // not other name that match with the given category name.
      if (!temp) {
        const updatedCategory = await this.database.category.update({
          where: { id: categoryId },
          data: {
            categoryName: category.categoryName,
            description: category.description,
          },
        });

        // if not updated well, this is may be internal server error.
        if (!updatedCategory) {
          throw new InternalServerErrorException('Internal server error while updating.');
        }
      } else {
        throw new NotAcceptableException('category name must be unique.');
      }
    } else {
      const updatedCategory = await this.database.category.update({
        where: { id: categoryId },
        data: {
          categoryName: category.categoryName,
          description: category.description,
        },
      });
      // if not updated well, this is may be internal server error.
      if (!updatedCategory) {
        throw new InternalServerErrorException('Internal server error while updating.');
      }
    }
    // success.
    return { message: 'your category has been updated successfully.' };
  }

  // delete one category once, by its id.
  async deleteOneById(id: string): Promise<Object> {
    if (!id) {
      throw new NotAcceptableException('id is required');
    }

    // find category
    const res = await this.database.category.findUnique({
      where: { id },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('category not found exception.');
    }
    // delete the category.
    const deletedRes = await this.database.category.delete({
      where: { id },
    });
    if (!deletedRes) {
      throw new NotFoundException('category not found');
    }
    return { message: 'category has been deleted successfully.' };
  }

  // delete one category once, by its id.
  async deleteOneByName(categoryName: string): Promise<Object> {
    if (!categoryName) {
      throw new NotAcceptableException('category name missing.');
    }

    // find category
    const res = await this.database.category.findUnique({
      where: { categoryName },
    });

    // if not found
    if (!res) {
      throw new NotFoundException('category not found exception.');
    }

    // delete the category.
    await this.database.category.delete({
      where: { categoryName },
    });

    return { message: 'category has been deleted successfully.' };
  }

  // delete all category once.
  async deleteAll() {
    // find category
    const res = await this.database.category.findMany();

    // if not found
    if (res.length == 0) {
      throw new NotFoundException('category not found exception.');
    }
    // delete categories
    await this.database.category.deleteMany();

    // return success message
    return { message: 'category has been deleted successfully' };
  }
}
