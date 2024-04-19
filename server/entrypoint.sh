#!/bin/bash

# Run Prisma migrations
echo "Running Prisma migrations"
npx prisma migrate deploy --schema ./prisma/schema.prisma

# Start the server
npm run start:prod --port 4444 --env-file .env now
