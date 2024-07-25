import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: "./src/entities",
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || '',
    ssl: false,
  },
  verbose: true,
  strict: true,
})
