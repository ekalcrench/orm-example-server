This Node JS Express as a backend that implemented Prisma ORM to connect into MongoDB

## Getting Started

First, run the development server:

```bash
npm run start
```

Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

All the sources code places in `src` folder.
The server is auto restart due to the package called `nodemon`.

## Prisma Circumtances

1. Open MongoDB Atlas for cloud database
2. Download MongoDB Compass to connect into MongoDB Atlas for better UI Interface
3. Create .env file that has DATABASE_URL=<connections/database_name>, you can see it in MongoDB Atlas for connections
4. Download @prisma/client
5. Create all model in schema.prisma file to make it easy, you can download prisma extension from VS Code
6. Run using this command "npx prisma generate" to generate all the prisma model that has been created in schema.prisma file locally
7. Run "npx prisma db push" to synchronice your db with local schema
