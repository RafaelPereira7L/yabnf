import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { ulid } from "ulid";

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
