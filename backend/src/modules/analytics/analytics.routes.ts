import { createRoute, z } from "@hono/zod-openapi";
//biome-ignore lint/performance/noNamespaceImport : here needed for clarity
import * as HTTPCODE from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const trendQuerySchema = z.object({
	days: z.coerce.number().min(1).max(180).default(30),
});

const trendSchema = z.array(
	z.object({
		date: z.string(),
		moods: z.record(z.string(), z.number()),
	})
);

const wordCountSchema = z.array(
	z.object({
		date: z.string(),
		averageWordCount: z.number(),
		entries: z.number(),
	})
);

const tagFrequencySchema = z.array(
	z.object({
		tag: z.string(),
		count: z.number(),
	})
);

const activityStreakSchema = z.object({
	current: z.number(),
	longest: z.number(),
});

const tags = ["Analytics"];

export const moodTrend = createRoute({
	method: "get",
	path: "/mood-trend",
	tags,
	summary: "Get mood trend ",
	request: {
		query: trendQuerySchema,
	},
	responses: {
		[HTTPCODE.OK]: jsonContent(trendSchema, "Mood trend"),
		[HTTPCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized Access"
		),
		[HTTPCODE.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid query parameters"),
			"Bad request"
		),
		[HTTPCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("No data found"),
			"Trend not found"
		),
	},
});

export const wordCountTrend = createRoute({
	method: "get",
	path: "/word-count",
	tags,
	summary: "Get word count trend ",
	request: {
		query: trendQuerySchema,
	},
	responses: {
		[HTTPCODE.OK]: jsonContent(wordCountSchema, "Word count trend"),
		[HTTPCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized Access"
		),
		[HTTPCODE.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid query parameters"),
			"Bad request"
		),
		[HTTPCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("No data found"),
			"Not found"
		),
	},
});

export const tagFrequency = createRoute({
	method: "get",
	path: "/tag-frequency",
	tags,
	summary: "Get tag frequency ",
	request: {
		query: trendQuerySchema,
	},
	responses: {
		[HTTPCODE.OK]: jsonContent(tagFrequencySchema, "Tag frequency"),
		[HTTPCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized Access"
		),

		[HTTPCODE.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Invalid query parameters"),
			"Bad request"
		),
	},
});

export const activityStreak = createRoute({
	method: "get",
	path: "/activity-streak",
	tags,
	summary: "Get activity streak ",
	responses: {
		[HTTPCODE.OK]: jsonContent(activityStreakSchema, "Activity streak"),
		[HTTPCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
	},
});

export type MoodTrendRoute = typeof moodTrend;
export type WordCountTrendRoute = typeof wordCountTrend;
export type TagFrequencyRoute = typeof tagFrequency;
export type ActivityStreakRoute = typeof activityStreak;
