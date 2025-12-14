import type { JournalEntry as DbJournalEntry } from "../../common/database/schema";
import type {
	CreateJournalEntryInput,
	JournalEntry,
	JournalSearchQuery,
	MoodSummary,
	UpdateJournalEntryInput,
} from "../../common/types/index.types";
import { journalRepository } from "./repositories.journal";

type JournalRow = DbJournalEntry;

const toJournalMetadata = (value: unknown) => {
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

	return { characterCount: 0, wordCount: 0 };
};

const toAttachments = (value: unknown) => {
	if (!Array.isArray(value)) {
		return [];
	}

	return value
		.filter(
			(item): item is { url: string; alt?: string } =>
				!!item &&
				typeof item === "object" &&
				typeof (item as { url?: unknown }).url === "string" &&
				(!("alt" in item) ||
					typeof (item as { alt?: unknown }).alt === "string")
		)
		.map((item) => ({
			url: item.url,
			alt: item.alt,
		}));
};
const toTags = (value: unknown) =>
	Array.isArray(value)
		? value.filter((tag): tag is string => typeof tag === "string")
		: [];

const toDto = (entry: JournalRow): JournalEntry => ({
	id: entry.id,
	userId: entry.userId,
	title: entry.title ?? null,
	content: entry.content,
	mood: entry.mood,
	tags: toTags(entry.tags),
	attachments: toAttachments(entry.attachments),
	metadata: toJournalMetadata(entry.metadata),
	createdAt: entry.createdAt.toISOString(),
	updatedAt: entry.updatedAt.toISOString(),
});

export const journalService = {
	async listRecent(userId: string, limit?: number) {
		const rows = await journalRepository.latest(userId, limit);
		return rows.map(toDto);
	},

	async getById(userId: string, id: string) {
		const entry = await journalRepository.findById(id, userId);
		return entry ? toDto(entry) : null;
	},

	async search(userId: string, query: JournalSearchQuery) {
		const result = await journalRepository.search(userId, query);
		return {
			data: result.data.map(toDto),
			nextCursor: result.nextCursor,
			hasMore: result.hasMore,
		};
	},

	async create(userId: string, payload: CreateJournalEntryInput) {
		const entry = await journalRepository.create(userId, payload);
		return toDto(entry);
	},

	async update(userId: string, id: string, payload: UpdateJournalEntryInput) {
		const entry = await journalRepository.update(id, userId, payload);

		if (!entry) {
			return null;
		}

		return toDto(entry);
	},

	async remove(userId: string, id: string) {
		const entry = await journalRepository.remove(id, userId);
		return entry ? toDto(entry) : null;
	},

	async moodSummary(userId: string, days?: number): Promise<MoodSummary[]> {
		return await journalRepository.moodSummary(userId, days);
	},

	async total(userId: string): Promise<number> {
		return await journalRepository.total(userId);
	},
};
