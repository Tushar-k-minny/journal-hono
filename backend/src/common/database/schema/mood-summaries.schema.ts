import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import { moodEnum } from "./enums.schema";
import { users } from "./users.schema";

export const moodSummaries = pgTable(
	"mood_summaries",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		summaryDate: timestamp("summary_date", { mode: "date" }).notNull(),
		mood: moodEnum("mood").notNull(),
		count: integer("count").notNull().default(0),
		createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { mode: "date" })
			.defaultNow()
			.notNull()
			.$onUpdate(() => new Date()),
	},
	(table) => ({
		userIdSummaryDateMoodUnique: unique(
			"mood_summaries_user_id_summary_date_mood_unique"
		).on(table.userId, table.summaryDate, table.mood),
		userIdSummaryDateIdx: index("mood_summaries_user_id_summary_date_idx").on(
			table.userId,
			table.summaryDate
		),
	})
);

// Relations
export const moodSummariesRelations = relations(moodSummaries, ({ one }) => ({
	user: one(users, {
		fields: [moodSummaries.userId],
		references: [users.id],
	}),
}));

// Types
export type MoodSummary = typeof moodSummaries.$inferSelect;
export type NewMoodSummary = typeof moodSummaries.$inferInsert;
