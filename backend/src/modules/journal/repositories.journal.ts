import {
	and,
	arrayContains,
	asc,
	count,
	desc,
	eq,
	gte,
	ilike,
	lte,
	ne,
} from "drizzle-orm";
import db from "../../common/database";
import {
	type MoodSummary as DbMoodSummary,
	journalEntries,
	moodSummaries,
} from "../../common/database/schema";
import type {
	CreateJournalEntryInput,
	JournalSearchQuery,
	MoodSummary,
	UpdateJournalEntryInput,
} from "../../common/types/index.types";

const REGEX = /\s+/;

const mapSummaryRow = (row: DbMoodSummary): MoodSummary => ({
	date: row.summaryDate.toISOString().split("T")[0] ?? "",
	mood: row.mood,
	count: row.count,
});

const buildMetadata = (content: string) => ({
	wordCount: content.trim().split(REGEX).filter(Boolean).length,
	characterCount: content.length,
});

const buildSearchWhere = (userId: string, query: JournalSearchQuery) => {
	const conditions = [eq(journalEntries.userId, userId)];

	if (query.q) {
		conditions.push(ilike(journalEntries.content, `%${query.q}%`));
	}

	if (query.mood) {
		conditions.push(eq(journalEntries.mood, query.mood));
	}

	if (query.from) {
		conditions.push(gte(journalEntries.createdAt, query.from));
	}

	if (query.to) {
		conditions.push(lte(journalEntries.createdAt, query.to));
	}

	if (query?.tags?.length) {
		for (const tag of query.tags) {
			conditions.push(arrayContains(journalEntries.tags, [tag]));
		}
	}

	return and(...conditions);
};

export const journalRepository = {
	async findById(id: string, userId: string) {
		const [entry] = await db
			.select()
			.from(journalEntries)
			.where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)));
		return entry || null;
	},

	async search(userId: string, query: JournalSearchQuery) {
		const whereClause = buildSearchWhere(userId, query);
		const limit = (query.limit ?? 20) + 1;

		const conditions = [whereClause];

		if (query.cursor) {
			const [cursorEntry] = await db
				.select({ createdAt: journalEntries.createdAt })
				.from(journalEntries)
				.where(
					and(
						eq(journalEntries.id, query.cursor),
						eq(journalEntries.userId, userId)
					)
				);

			if (cursorEntry) {
				const op =
					query.sort === "asc"
						? gte(journalEntries.createdAt, cursorEntry.createdAt)
						: lte(journalEntries.createdAt, cursorEntry.createdAt);
				conditions.push(op);
				// We also need to exclude the cursor itself to avoid duplicates if timestamps are exact,
				// or use (createdAt, id) tuple comparison.
				// For simplicity here, we might just assume unique timestamps or accept slight overlap risk for now,
				// BUT better to exclude the exact ID too.
				conditions.push(ne(journalEntries.id, query.cursor));
			}
		}

		const orderBy =
			query.sort === "asc"
				? asc(journalEntries.createdAt)
				: desc(journalEntries.createdAt);

		const rows = await db
			.select()
			.from(journalEntries)
			.where(and(...conditions))
			.orderBy(orderBy)
			.limit(limit);

		const hasMore = rows.length >= limit;
		const data = hasMore ? rows.slice(0, limit - 1) : rows;
		const nextCursor = data.length > 0 ? (data.at(-1)?.id ?? null) : null;

		return {
			data,
			nextCursor,
			hasMore,
		};
	},

	async create(userId: string, payload: CreateJournalEntryInput) {
		const metadata = payload.metadata ?? buildMetadata(payload.content);

		const attachments = (payload.attachments ?? []).map((a) => ({
			url: a.url,
			type: "image",
			name: a.alt ?? "attachment",
		}));

		const [entry] = await db
			.insert(journalEntries)
			.values({
				userId,
				title: payload.title ?? null,
				content: payload.content,
				mood: payload.mood,
				tags: payload.tags ?? [],
				metadata,
				attachments,
			})
			.returning();

		if (!entry) {
			throw new Error("Failed to create journal entry");
		}

		return entry;
	},

	async update(id: string, userId: string, payload: UpdateJournalEntryInput) {
		const updateValues: Partial<typeof journalEntries.$inferInsert> = {};

		if (payload.title !== undefined) {
			updateValues.title = payload.title ?? null;
		}
		if (payload.content !== undefined) {
			updateValues.content = payload.content;
			updateValues.metadata =
				payload.metadata ?? buildMetadata(payload.content);
		}
		if (payload.mood !== undefined) {
			updateValues.mood = payload.mood;
		}
		if (payload.tags !== undefined) {
			updateValues.tags = payload.tags;
		}
		if (payload.attachments !== undefined) {
			updateValues.attachments = payload.attachments.map((a) => ({
				url: a.url,
				type: "image",
				name: a.alt ?? "attachment",
			}));
		}

		if (Object.keys(updateValues).length === 0) {
			return await journalRepository.findById(id, userId);
		}

		const [updated] = await db
			.update(journalEntries)
			.set(updateValues)
			.where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
			.returning();

		return updated || null;
	},

	async remove(id: string, userId: string) {
		const [deleted] = await db
			.delete(journalEntries)
			.where(and(eq(journalEntries.id, id), eq(journalEntries.userId, userId)))
			.returning();

		return deleted || null;
	},

	async latest(userId: string, limit = 35) {
		try {
			return await db
				.select()
				.from(journalEntries)
				.where(eq(journalEntries.userId, userId))
				.orderBy(desc(journalEntries.createdAt))
				.limit(limit);
		} catch (error) {
			console.error("Drizzle Error Details:", error);
			throw error;
		}
	},

	async total(userId: string): Promise<number> {
		const [result] = await db
			.select({ count: count() })
			.from(journalEntries)
			.where(eq(journalEntries.userId, userId));

		return result?.count ?? 0;
	},

	async moodSummary(userId: string, days = 7) {
		const since = new Date();
		since.setDate(since.getDate() - days);

		const rows = await db
			.select()
			.from(moodSummaries)
			.where(
				and(
					eq(moodSummaries.userId, userId),
					gte(moodSummaries.summaryDate, since)
				)
			)
			.orderBy(asc(moodSummaries.summaryDate));

		return rows.map(mapSummaryRow);
	},
};
