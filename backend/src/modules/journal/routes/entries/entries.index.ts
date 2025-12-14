import { createRouter } from "../../../../lib/create-app";
import {
	CreateEntryHandler,
	DeleteEntryHandler,
	GetAllEntriesHandler,
	GetEntryHandler,
	TotalEntriesHandler,
	UpdateEntryHandler,
} from "./entries.handler";
import {
	createEntry,
	deleteEntry,
	getAllEntries,
	getEntry,
	totalEntries,
	updateEntry,
} from "./entries.routes";

const entriesRouter = createRouter()
	.basePath("/entries")
	.openapi(getAllEntries, GetAllEntriesHandler)
	.openapi(totalEntries, TotalEntriesHandler)
	.openapi(createEntry, CreateEntryHandler)
	.openapi(getEntry, GetEntryHandler)
	.openapi(updateEntry, UpdateEntryHandler)
	.openapi(deleteEntry, DeleteEntryHandler);

export default entriesRouter;
