# Installation

This project uses [NestJS](https://nestjs.com/) and [TypeORM](https://www.npmjs.com/package/typeorm) with [PostgreSQL](https://www.postgresql.org/) as the main database. It also includes services for file storage (MinIO), email (Maildev), and database management (Adminer), all orchestrated with Docker Compose.

---

## Table of Contents <!-- omit in toc -->

- [Development Setup](#development-setup)
- [Quick Start](#quick-start)
- [Services](#services)
- [Links](#links)

---

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dunseen/museum-api.git
   cd museum-api
   ```

1. Copy the environment example and configure your environment variables:

   ```bash
   cp env-example .env
   # Edit .env as needed
   ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Start the required services (PostgreSQL, MinIO, Adminer, Maildev):

   ```bash
   docker compose up -d postgres minio adminer maildev
   ```

1. Run database migrations:

   ```bash
   npm run migration:run
   ```

1. Seed the database:

   ```bash
   npm run seed:run
   ```

1. Start the application in development mode:

   ```bash
   npm run start:dev
   ```

1. Access the app at <http://localhost:3333>

---

## Quick Start

If you want to run everything with a single command (all services and the app):

1. Clone the repository and copy the environment file:

   ```bash
   git clone https://github.com/dunseen/museum-api.git
   cd museum-api
   cp env-example .env
   # Edit .env as needed
   ```

1. Start all containers (API, DB, MinIO, Adminer, Maildev):

   ```bash
   docker compose up -d
   ```

1. Check logs (optional):

   ```bash
   docker compose logs
   ```

1. Access the app at <http://localhost:3333>

---

## Services

- **API**: <http://localhost:3333>
- **Swagger (API docs)**: <http://localhost:3333/docs>
- **Adminer (DB client)**: <http://localhost:8080>
- **Maildev (Email testing)**: <http://localhost:1080>
- **MinIO (File storage)**: <http://localhost:9001>

---

## Scripts

- `npm run migration:run` — Run database migrations
- `npm run seed:run` — Seed the database
- `npm run start:dev` — Start the app in development mode
- `npm run start:prod` — Start the app in production mode
- `npm run test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests

---

Previous: [Introduction](introduction.md)

Next: [Architecture](architecture.md)
