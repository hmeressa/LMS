# Server for IE-Network Solutions Learning management System.

## Installation steps

- Follow the bellow steps to run the system.

--- 
### Install nodemodule

```bash
$ yarn install
```

### environment variable setup

```bash
# create .env file at root directory then pest this command into it. After that replace the necessary values by yours...
DATABASE_URL='DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public'
PORT = '4444' # your port
JWT_SECRET = 'your secret code'

SENDER_EMAIL=ienetworksolutions.lms@gmail.com 
PASSWORD=vbllpmwhtnbrikms
```
### Seeder file setup
```bash
# open server/src/seeder/seeder.service.ts file and change all info by yours, including the email.

const email = 'youremail@gmail.com'; # at line 22

```
### Run Prisma

```bash

# Browse your data
$ prisma studio

# Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
$ prisma migrate dev

# Pull the schema from an existing database, updating the Prisma schema
$ prisma db pull

# Push the Prisma schema state to the database
$ prisma db push

# Validate your Prisma schema
$ prisma validate

# Format your Prisma schema
$ prisma format
```

### Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

# e2e test using custom script
$ yarn db:test:restart
```

URL

```bash
  # finally you will access those URLs

  # host url
  - The server will be started at http://localhost:4444

  # swagger docs url
  You are prompt to access the docs at http://localhost:4444/api

  # prisma url
  $ npx prisma studio
  you will access the database via prisma at http://localhost:5555

```

<i>Authour: Belay Birhanu</i>
