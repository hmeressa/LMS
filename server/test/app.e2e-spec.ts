import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service";

describe('App e2e', () =>{
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async ()=> {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleRef.createNestApplication();
  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this will exclude data that is not defined on our model.
    }), 
    );
    await app.init();

    prisma = app.get(PrismaService);
    // await prisma.cleanDb();
  });
  afterAll(()=> {
    // app.close();
  })
  it.todo('should pass');
})