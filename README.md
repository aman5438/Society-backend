🏢 Society Management App Backend (NestJS + Prisma + PostgreSQL)

This is the backend service for a simple Society Management App built with NestJS, Prisma, and PostgreSQL. It provides role-based access for admins and owners to manage flats, owners, and tenants.

🚀 Features

🔐 Authentication (JWT)

Admin and Owner login

Role-based guards using decorators

🏠 Admin Features

Manage Flats (Add, Update, Delete, View)

Manage Owners (Add, Update, Delete, View)

👤 Owner Features

Manage Tenants for owned flats (Add, Update, Delete, View)

🧾 API Documentation

Integrated Swagger at /api

🧱 Tech Stack

Framework: NestJS

ORM: Prisma

Database: PostgreSQL

Authentication: JWT

Docs: Swagger

⚙️ Installation

1. Clone this repo

git clone https://github.com/adityagadekar-codenote/society-app.git
cd society-app

2. Install dependencies

npm install

3. Setup .env

DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/society_db"
JWT_SECRET="supersecretjwt"
JWT_EXPIRES_IN="1d"
SOCIETY_FRONTEND_URL=''

4. Create database manually

# open psql or pgAdmin and run
CREATE DATABASE society_db;

5. Run migrations

npx prisma migrate dev --name init

6. Start the server

npm run start:dev

Visit Swagger UI at: http://localhost:3000/api

🔐 Test Users

Admin Login

{
  "email": "admin@example.com",
  "password": "adminpass"
}

Create manually with POST /auth/signup and role: admin

Owner Login

{
  "email": "owner@example.com",
  "password": "ownerpass"
}

Add by admin via POST /auth/signup and role: owner