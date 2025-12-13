import authRouter from "@auth/index.auth";

import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { pinoLogger } from "hono-pino";

import { env } from "@/env";
import configureOpenAPI from "@/lib/configure-open-api-app";
import createApp from "@/lib/create-app";
import type { AppBindings } from "@/lib/types";
import healthRouter from "@/modules/health";
import { logger } from "@/utils/logger";

const app = new Hono<AppBindings>();

const api = createApp();
configureOpenAPI(api);

app.use(requestId());

app.use(
	"*",
	pinoLogger({
		pino: logger,
	})
);
app.use("*", prettyJSON());

app.get("/", (c) => {
	logger.error("hello");
	return c.text("Hello Hono!");
});

const routes = [healthRouter, authRouter] as const;

for (const route of routes) {
	api.route("/", route);
}
app.route("/", api);
const port = Number(env.PORT ?? 5000);

logger.info({ port }, "auth service listening");

export default {
	port,
	fetch: app.fetch,
};
