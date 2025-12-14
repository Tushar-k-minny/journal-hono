import { requireAuth } from "../../common/middlewares/require-auth.middlewares";
import { createRouter } from "../../lib/create-app";
import {
	activityStreakHandler,
	moodTrendHandler,
	tagFrequencyHandler,
	wordCountTrendHandler,
} from "./analytics.handler";
import {
	activityStreak,
	moodTrend,
	tagFrequency,
	wordCountTrend,
} from "./analytics.routes";

const analyticsRouter = createRouter()
	.basePath("/analytics")
	.openapi(moodTrend, moodTrendHandler)
	.openapi(wordCountTrend, wordCountTrendHandler)
	.openapi(tagFrequency, tagFrequencyHandler)
	.openapi(activityStreak, activityStreakHandler);

analyticsRouter.use(requireAuth);

export default analyticsRouter;
