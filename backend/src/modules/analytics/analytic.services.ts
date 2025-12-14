import { formatISO, startOfDay, subDays } from "date-fns";
import { and, asc, eq, gte } from "drizzle-orm";
import db from "../../common/database";
import { journalEntries } from "../../common/database/schema";

const toDayKey = (date: Date) =>
	formatISO(startOfDay(date), { representation: "date" });

const extractMetadata = (value: unknown) => {
	if (
		value &&
		typeof value === "object" &&
		"wordCount" in value &&
		"characterCount" in value
	) {
		const record = value as Record<string, unknown>;
		return {
			wordCount: Number(record.wordCount) || 0,
			characterCount: Number(record.characterCount) || 0,
		};
	}

	return { wordCount: 0, characterCount: 0 };
};

export const analyticsService = {
	async moodTrend(userId: string, days = 30) {
		const since = subDays(new Date(), days);

		const rows = await db
			.select({
				createdAt: journalEntries.createdAt,
				mood: journalEntries.mood,
			})
			.from(journalEntries)
			.where(
				and(
					eq(journalEntries.userId, userId),
					gte(journalEntries.createdAt, since)
				)
			)
			.orderBy(asc(journalEntries.createdAt));

		const trend: Record<string, Record<string, number>> = {};

		for (const row of rows) {
			if (!row.mood) {
				continue;
			}
			const day = toDayKey(row.createdAt);
			trend[day] ??= {};
			trend[day][row.mood] = (trend[day][row.mood] ?? 0) + 1;
		}

		return Object.entries(trend).map(([date, moods]) => ({ date, moods }));
	},

	async wordCountTrend(userId: string, days = 30) {
		try {
			const since = subDays(new Date(), days);

			const rows = await db
				.select({
					createdAt: journalEntries.createdAt,
					metadata: journalEntries.metadata,
				})
				.from(journalEntries)
				.where(
					and(
						eq(journalEntries.userId, userId),
						gte(journalEntries.createdAt, since)
					)
				)
				.orderBy(asc(journalEntries.createdAt));

			const trend: Record<string, { wordCount: number; entries: number }> = {};

			for (const row of rows) {
				const day = toDayKey(row.createdAt);
				trend[day] ??= { wordCount: 0, entries: 0 };
				const metadata = extractMetadata(row.metadata);
				trend[day].wordCount += metadata.wordCount;
				trend[day].entries += 1;
			}

			return Object.entries(trend).map(([date, value]) => ({
				date,
				averageWordCount:
					value.entries > 0 ? Math.round(value.wordCount / value.entries) : 0,
				entries: value.entries,
			}));
		} catch (error) {
			console.error(error);
			throw new Error("Failed to fetch the word count trend");
		}
	},

	async tagFrequency(userId: string, limit = 20) {
		const rows = await db
			.select({ tags: journalEntries.tags })
			.from(journalEntries)
			.where(eq(journalEntries.userId, userId));

		const frequency: Record<string, number> = {};

		for (const row of rows) {
			if (!Array.isArray(row.tags)) {
				continue;
			}
			for (const tag of row.tags) {
				if (typeof tag !== "string") {
					continue;
				}
				frequency[tag] = (frequency[tag] ?? 0) + 1;
			}
		}

		return Object.entries(frequency)
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([tag, count]) => ({ tag, count }));
	},

	async activityStreak(
		userId: string
	): Promise<{ current: number; longest: number }> {
		const rows = await db
			.select({ createdAt: journalEntries.createdAt })
			.from(journalEntries)
			.where(eq(journalEntries.userId, userId))
			.orderBy(asc(journalEntries.createdAt));

		if (!rows.length) {
			return { current: 0, longest: 0 };
		}

		let current = 1;
		let longest = 1;

		for (let index = 1; index < rows.length; index += 1) {
			const prevRow = rows[index - 1];
			const currentRow = rows[index];

			if (!(prevRow && currentRow)) {
				continue;
			}

			const prev = startOfDay(prevRow.createdAt);
			const currentDate = startOfDay(currentRow.createdAt);
			const diff =
				(currentDate.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

			if (diff === 1) {
				current += 1;
				longest = Math.max(longest, current);
			} else if (diff > 1) {
				current = 1;
			}
		}

		const last = rows.at(-1);
		if (!last) {
			return { current, longest };
		}

		const lastEntryDay = startOfDay(last.createdAt);
		const today = startOfDay(new Date());
		const daysSinceLastEntry =
			(today.getTime() - lastEntryDay.getTime()) / (1000 * 60 * 60 * 24);

		const currentStreak = daysSinceLastEntry <= 1 ? current : 0;

		return { current: currentStreak, longest };
	},
};
