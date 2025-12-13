import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { journalEntries } from "./journal-entries.schema";
import { moodSummaries } from "./mood-summaries.schema";
import { sessions } from "./sessions.schema";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: text("email").notNull().unique(),
	displayName: text("display_name").notNull(),
	passwordHash: text("password_hash").notNull(),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: "date" })
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	journalEntries: many(journalEntries),
	sessions: many(sessions),
	moodSummaries: many(moodSummaries),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
