import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { rateLimiter } from "hono-rate-limiter";
import { env } from "./env";
import configureOpenAPI from "./lib/configure-open-api-app";
import createApp from "./lib/create-app";
import analyticsRouter from "./modules/analytics/index.analytics";
import authRouter from "./modules/auth/index.auth";
import healthRouter from "./modules/health";
import journalApp from "./modules/journal/index.journal";

const app = new Hono();

const api = createApp();
configureOpenAPI(api);

app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		limit: 1, // Limit each client to 100 requests per window
		keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "", // Use IP address as key
	})
);

app.use(requestId());

app.use(logger());

app.use("*", prettyJSON());

app.get("/", (c) => c.text("Hello Hono!"));

const routes = [healthRouter, authRouter, journalApp, analyticsRouter] as const;

for (const route of routes) {
	api.route("/", route);
}
app.route("/", api);
const port = Number(env.PORT ?? 5000);

console.log(`auth service listening on port ${port}`);

export default {
	port,
	fetch: app.fetch,
};
