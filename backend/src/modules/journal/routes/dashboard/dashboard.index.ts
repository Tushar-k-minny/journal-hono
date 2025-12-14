import { createRouter } from "../../../../lib/create-app";
import { MoodSummaryHandler, RecentEntriesHandler } from "./dashboard.handlers";
import { moodSummary, recentEntries } from "./dashboard.routes";

const dashboardRouter = createRouter()
	.basePath("/dashboard")
	.openapi(recentEntries, RecentEntriesHandler)
	.openapi(moodSummary, MoodSummaryHandler);

export default dashboardRouter;
