//biome-ignore lint/performance/noNamespaceImport : needed here
import * as HTTPSCODE from "stoker/http-status-codes";
import type { JournalSearchQuery } from "../../../../common/types/journal.types";
import type { AppRouteHandler } from "../../../../lib/types";
import { journalService } from "../../services.journal";
import type {
	CreateEntryRoute,
	DeleteEntryRoute,
	GetAllEntriesRoute,
	GetEntryRoute,
	TotalEntriesRoute,
	UpdateEntryRoute,
} from "./entries.routes";

export const GetAllEntriesHandler: AppRouteHandler<GetAllEntriesRoute> = async (
	c
) => {
	try {
		const userId = c.var.user.id;

		const query = c.req.valid("query");

		const entries = await journalService.search(userId, {
			...query,
		} as JournalSearchQuery);
		return c.json(entries, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const GetEntryHandler: AppRouteHandler<GetEntryRoute> = async (c) => {
	try {
		const userId = c.var.user.id;
		const { id } = c.req.valid("param");

		const entry = await journalService.getById(userId, id);

		if (!entry) {
			return c.json({ message: "Entry not found" }, HTTPSCODE.NOT_FOUND);
		}

		return c.json(entry, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const CreateEntryHandler: AppRouteHandler<CreateEntryRoute> = async (
	c
) => {
	try {
		const userId = c.var.user.id;

		const payload = c.req.valid("json");

		const entry = await journalService.create(userId, payload);

		return c.json(entry, HTTPSCODE.CREATED);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const UpdateEntryHandler: AppRouteHandler<UpdateEntryRoute> = async (
	c
) => {
	try {
		const userId = c.var.user.id;
		const { id } = c.req.valid("param");
		const payload = c.req.valid("json");

		const entry = await journalService.update(userId, id, payload);

		if (!entry) {
			return c.json({ message: "Entry not found" }, HTTPSCODE.NOT_FOUND);
		}

		return c.json(entry, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const DeleteEntryHandler: AppRouteHandler<DeleteEntryRoute> = async (
	c
) => {
	try {
		const userId = c.var.user.id;
		const { id } = c.req.valid("param");

		const entry = await journalService.remove(userId, id);
		if (!entry) {
			return c.json({ message: "Entry not found" }, HTTPSCODE.NOT_FOUND);
		}

		return c.body(null, HTTPSCODE.NO_CONTENT);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const TotalEntriesHandler: AppRouteHandler<TotalEntriesRoute> = async (
	c
) => {
	try {
		const userId = c.var.user.id;

		const total = await journalService.total(userId);

		return c.json({ total }, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal Server Error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};
