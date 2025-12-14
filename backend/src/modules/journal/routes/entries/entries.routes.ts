import { createRoute, z } from "@hono/zod-openapi";

//biome-ignore  lint/performance/noNamespaceImport  : http codes needed
import * as HTTPSCODE from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
	createErrorSchema,
	createMessageObjectSchema,
	IdUUIDParamsSchema,
} from "stoker/openapi/schemas";

import { requireAuth } from "../../../../common/middlewares/require-auth.middlewares";
import {
	createJournalEntryInput,
	journalEntrySchema,
	journalSearchQuerySchema,
	paginatedJournalEntrySchema,
	updateJournalEntryInput,
} from "../../../../common/types/index.types";

const tags = ["Entries"];

export const getAllEntries = createRoute({
	method: "get",
	path: "/",
	tags,
	summary: "Get all Entries",
	request: {
		query: journalSearchQuerySchema,
	},
	responses: {
		[HTTPSCODE.OK]: jsonContent(paginatedJournalEntrySchema, "Get all Entries"),
		[HTTPSCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("No Entries found"),
			"No Entries found"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export const getEntry = createRoute({
	method: "get",
	tags,
	path: "/:id",
	summary: "Get Entry by ID",
	middleware: [requireAuth],
	request: { params: IdUUIDParamsSchema },
	responses: {
		[HTTPSCODE.OK]: jsonContent(journalEntrySchema, "Get Entry by ID"),
		[HTTPSCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Entry not found"),
			"Entry not found"
		),
		[HTTPSCODE.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdUUIDParamsSchema),
			"Unprocessable Entity"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export const createEntry = createRoute({
	method: "post",
	tags,
	path: "/",
	summary: "Create Entry",
	middleware: [requireAuth],
	request: {
		body: jsonContent(createJournalEntryInput, "Journal Entry content"),
	},
	responses: {
		[HTTPSCODE.CREATED]: jsonContent(journalEntrySchema, "Create Entry"),
		[HTTPSCODE.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(createJournalEntryInput),
			"Unprocessable Entity"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export const updateEntry = createRoute({
	method: "patch",
	tags,
	path: "/:id",
	summary: "Update Entry",
	middleware: [requireAuth],
	request: {
		params: IdUUIDParamsSchema,
		body: jsonContentRequired(updateJournalEntryInput, "Journal Entry content"),
	},
	responses: {
		[HTTPSCODE.OK]: jsonContent(journalEntrySchema, "Patch Entry"),
		[HTTPSCODE.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(updateJournalEntryInput),
			"Unprocessable Entity"
		),
		[HTTPSCODE.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Entry not found"),
			"Entry not found"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export const deleteEntry = createRoute({
	method: "delete",
	tags,
	path: "/:id",
	summary: "Delete Entry",
	middleware: [requireAuth],
	request: {
		params: IdUUIDParamsSchema,
	},
	responses: {
		[HTTPSCODE.NO_CONTENT]: { description: "Entry deleted" },
		[HTTPSCODE.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(IdUUIDParamsSchema),
			"Unprocessable Entity"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export const totalEntries = createRoute({
	method: "get",
	tags,
	path: "/total",

	summary: "Total Entries",

	responses: {
		[HTTPSCODE.OK]: jsonContent(
			z.object({ total: z.number().min(0) }),
			"Total Entries"
		),
		[HTTPSCODE.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPSCODE.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal Server Error"),
			"Internal Server Error"
		),
	},
});

export type GetAllEntriesRoute = typeof getAllEntries;
export type GetEntryRoute = typeof getEntry;
export type CreateEntryRoute = typeof createEntry;
export type UpdateEntryRoute = typeof updateEntry;
export type DeleteEntryRoute = typeof deleteEntry;
export type TotalEntriesRoute = typeof totalEntries;
