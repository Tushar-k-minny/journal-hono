import { relations } from "drizzle-orm";
import {
	index,
	json,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { moodEnum } from "./enums.schema";
import { users } from "./users.schema";

export const journalEntries = pgTable(
	"journal_entries",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		title: text("title"),
		content: text("content").notNull(),
		mood: moodEnum("mood").notNull(),
		tags: text("tags").array().notNull().default([]),
		attachments: json("attachments")
			.$type<Array<{ url: string; type: string; name: string }>>()
			.notNull()
			.default([]),
		//biome-ignore lint/suspicious/noExplicitAny : suppress this
		metadata: json("metadata").$type<Record<string, any>>().notNull(),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		userIdCreatedAtIdx: index("journal_entries_user_id_created_at_idx").on(
			table.userId,
			table.createdAt
		),
	})
);

// Relations
export const journalEntriesRelations = relations(journalEntries, ({ one }) => ({
	user: one(users, {
		fields: [journalEntries.userId],
		references: [users.id],
	}),
}));

// Types
export type JournalEntry = typeof journalEntries.$inferSelect;
export type NewJournalEntry = typeof journalEntries.$inferInsert;
