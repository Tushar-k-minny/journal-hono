//biome-ignore lint/performance/noNamespaceImport : httpcodes
import * as HTTPSCODE from "stoker/http-status-codes";
import type { AppRouteHandler } from "../../lib/types";
import { analyticsService } from "./analytic.services";
import type {
	ActivityStreakRoute,
	MoodTrendRoute,
	TagFrequencyRoute,
	WordCountTrendRoute,
} from "./analytics.routes";

export const moodTrendHandler: AppRouteHandler<MoodTrendRoute> = async (c) => {
	const userId = c.var.user.id;
	const days = Number.parseInt(c.req.query("days") || "30", 10) || 0;
	if (!userId) {
		return c.json(
			{
				message: "Unauthorized",
			},
			HTTPSCODE.UNAUTHORIZED
		);
	}
	if (days <= 0) {
		return c.json({ message: "Invalid Query" }, HTTPSCODE.BAD_REQUEST);
	}
	const trend = await analyticsService.moodTrend(userId, days);
	return c.json(trend, HTTPSCODE.OK);
};

export const wordCountTrendHandler: AppRouteHandler<
	WordCountTrendRoute
> = async (c) => {
	const userId = c.var.user.id;
	const days = Number.parseInt(c.req.query("days") || "30", 10) || 0;
	if (!userId) {
		return c.json(
			{
				message: "Unauthorized",
			},
			HTTPSCODE.UNAUTHORIZED
		);
	}
	if (days <= 0) {
		return c.json({ message: "Invalid Query" }, HTTPSCODE.BAD_REQUEST);
	}
	const trend = await analyticsService.wordCountTrend(userId, days);

	return c.json(trend, HTTPSCODE.OK);
};

export const tagFrequencyHandler: AppRouteHandler<TagFrequencyRoute> = async (
	c
) => {
	const userId = c.var.user.id;
	const days = Number.parseInt(c.req.query("days") || "30", 10) || 0;
	if (!userId) {
		return c.json(
			{
				message: "Unauthorized",
			},
			HTTPSCODE.UNAUTHORIZED
		);
	}
	if (days <= 0) {
		return c.json({ message: "Invalid Query" }, HTTPSCODE.BAD_REQUEST);
	}
	const trend = await analyticsService.tagFrequency(userId, days);

	return c.json(trend, HTTPSCODE.OK);
};

export const activityStreakHandler: AppRouteHandler<
	ActivityStreakRoute
> = async (c) => {
	const userId = c.var.user.id;

	if (!userId) {
		return c.json(
			{
				message: "Unauthorized",
			},
			HTTPSCODE.UNAUTHORIZED
		);
	}
	const streak = await analyticsService.activityStreak(userId);

	return c.json(streak, HTTPSCODE.OK);
};
