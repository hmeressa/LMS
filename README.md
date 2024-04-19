# IE-Network-Solutions-LMS

## Introduction

Welcome to the IE Network Solution Learning Management System project! This is a comprehensive platform designed to simplify the process of course management in IE Network Solutions.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed.
- Docker (optional for containerized deployments).
- PostgreSQL installed and configured.

### Installation

1. Clone the repository:

2. Navigate to the project directory:

   ```bash
   cd IE-Network-Solutions-LMS
   ```

3. Install dependencies in both **client** and **server** directories:

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd server
   npm install
   ```

4. Configuration

   Configure database settings, environment variables, and other settings as necessary in .env files (see _.env.example_)

## Usage

1. Start the application:

   ```bash
   cd server
   npm run start:dev
   ```

   ```bash
   cd client
   npm start
   ```

2. Access the LMS in your web browser at http://localhost:3000 (or your configured port).

## If you are using docker

In the project root directory run the following commands

```bash
docker compose build
docker compose up -d
```
