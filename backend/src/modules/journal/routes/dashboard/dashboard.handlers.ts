//biome-ignore  lint/performance/noNamespaceImport  : http codes needed
import * as HTTPSCODE from "stoker/http-status-codes";
import type { AppRouteHandler } from "../../../../lib/types";
import { journalService } from "../../services.journal";
import type { MoodSummaryRoute, RecentEntriesRoute } from "./dashboard.routes";

export const RecentEntriesHandler: AppRouteHandler<RecentEntriesRoute> = async (
	c
) => {
	const userId = c.var.user.id;
	const limit: number = Number.parseInt(c.req.query("limit") || "30", 10) || 30;

	const entries = await journalService.listRecent(userId, limit);

	return c.json(entries, HTTPSCODE.OK);
};

export const MoodSummaryHandler: AppRouteHandler<MoodSummaryRoute> = async (
	c
) => {
	const userId = c.var.user.id;
	const limit = Number.parseInt(c.req.query("limit") || "7", 10) || 7;
	const summary = await journalService.moodSummary(userId, limit);

	return c.json(summary, HTTPSCODE.OK);
};
