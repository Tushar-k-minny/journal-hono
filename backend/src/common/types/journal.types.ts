import { z } from "zod";

export const moodSchema = z.enum([
	"joyful",
	"content",
	"neutral",
	"anxious",
	"stressed",
	"sad",
	"angry",
]);

export const attachmentSchema = z.object({
	url: z.string().url(),
	alt: z.string().optional(),
});

export const journalMetadataSchema = z.object({
	wordCount: z.number().int().nonnegative(),
	characterCount: z.number().int().nonnegative(),
});

export const journalEntrySchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
	title: z.string().max(180).nullable(),
	content: z.string().min(1),
	mood: moodSchema,
	tags: z.array(z.string().min(1).max(32)).max(12),
	attachments: z.array(attachmentSchema),
	metadata: journalMetadataSchema,
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const createJournalEntryInput = journalEntrySchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		metadata: true,
	})
	.extend({
		title: z.string().max(180).nullable().optional(),
		attachments: z.array(attachmentSchema).optional(),
		metadata: journalMetadataSchema.optional(),
	});

export const updateJournalEntryInput = createJournalEntryInput
	.omit({ userId: true, metadata: true })
	.extend({ metadata: journalMetadataSchema.optional() })
	.partial();

const tagsPreprocessor = (value: unknown) => {
	if (!value) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	if (typeof value === "string") {
		return value
			.split(",")
			.map((tag) => tag.trim())
			.filter(Boolean);
	}

	return [];
};

export const journalSearchQuerySchema = z.object({
	q: z.string().optional(),
	from: z.coerce.date().optional(),
	to: z.coerce.date().optional(),
	mood: moodSchema.optional(),
	tags: z
		.preprocess(tagsPreprocessor, z.array(z.string().min(1).max(32)).optional())
		.optional(),
	limit: z.coerce.number().int().min(1).max(120).default(20),
	cursor: z.uuid().optional(),
	sort: z.enum(["asc", "desc"]).default("desc").optional(),
});

export const moodSummarySchema = z.object({
	date: z.string().date(),
	mood: moodSchema,
	count: z.number().int().nonnegative(),
});

export const streakSchema = z.object({
	current: z.number().int().nonnegative(),
	longest: z.number().int().nonnegative(),
	lastUpdatedAt: z.string().datetime(),
});

export type Mood = z.infer<typeof moodSchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type CreateJournalEntryInput = z.infer<typeof createJournalEntryInput>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntryInput>;
export type MoodSummary = z.infer<typeof moodSummarySchema>;
export type JournalSearchQuery = z.infer<typeof journalSearchQuerySchema>;
export type Streak = z.infer<typeof streakSchema>;
