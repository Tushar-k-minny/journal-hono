import { createRoute, z } from "@hono/zod-openapi";

//biome-ignore  lint/performance/noNamespaceImport  : http codes needed
import * as HTTPSCODE from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { requireAuth } from "../../../../common/middlewares/require-auth.middlewares";
import {
	journalEntrySchema,
	moodSummarySchema,
} from "../../../../common/types/journal.types";

const tags = ["Dashboard"];

export const recentEntries = createRoute({
	method: "get",
	path: "/recent",
	tags,
	summary: "Get recent entries",
	request: {
		query: z.object({
			limit: z.coerce.number().min(1).max(120).default(30),
		}),
	},
	responses: {
		[HTTPSCODE.OK]: jsonContent(
			z.array(journalEntrySchema),
			"Get recent entries"
		),
		[HTTPSCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("No recent entries found"),
			"No recent entries found"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal server error"),
			"Internal server error"
		),
	},
});

export const moodSummary = createRoute({
	method: "get",
	path: "/mood-summary",
	tags,
	summary: "Get mood summary",
	middleware: [requireAuth],
	request: {
		query: z.object({
			limit: z.coerce.number().min(1).max(30).default(7),
		}),
	},
	responses: {
		[HTTPSCODE.OK]: jsonContent(z.array(moodSummarySchema), "Get mood summary"),
		[HTTPSCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("No mood summary found"),
			"No mood summary found"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal server error"),
			"Internal server error"
		),
	},
});

export type RecentEntriesRoute = typeof recentEntries;
export type MoodSummaryRoute = typeof moodSummary;
