import { requireAuth } from "../../common/middlewares/require-auth.middlewares";
import configureOpenAPI from "../../lib/configure-open-api-app";
import createApp from "../../lib/create-app";
import dashboardRouter from "./routes/dashboard/dashboard.index";
import entriesRouter from "./routes/entries/entries.index";

const journalApp = createApp();
configureOpenAPI(journalApp);
journalApp.use(requireAuth);

const routes = [dashboardRouter, entriesRouter] as const;

for (const route of routes) {
	journalApp.route("/", route);
}

export default journalApp;
