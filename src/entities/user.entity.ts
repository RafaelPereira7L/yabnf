import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import { createInsertSchema } from 'drizzle-zod';

export const users = pgTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => ulid()),
	fullName: varchar("full_name", { length: 60 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
	password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type UserDTO = typeof users.$inferInsert;
export const CreateUserSchema = createInsertSchema(users, {
	fullName: (schema) => schema.fullName.min(1).max(60),
	email: (schema) => schema.email.min(6).max(256).email(),
	password: (schema) => schema.password.min(6).max(256),
});

export const UpdateUserSchema = createInsertSchema(users, {
	fullName: (schema) => schema.fullName.min(1).max(60).optional(),
	email: (schema) => schema.email.min(6).max(256).email().optional(),
	password: (schema) => schema.password.min(6).max(256).optional(),
});