import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { requestId } from "hono/request-id";
import { env } from "./env";
import configureOpenAPI from "./lib/configure-open-api-app";
import createApp from "./lib/create-app";
import authRouter from "./modules/auth/index.auth";
import healthRouter from "./modules/health";

const app = new Hono();

const api = createApp();
configureOpenAPI(api);

app.use(requestId());

// app.use(
// 	"*",
// 	pinoLogger({
// 		pino: logger,
// 	})
// );

app.use("*", prettyJSON());

app.get("/", (c) => {
	// logger.error("hello");
	return c.text("Hello Hono!");
});

const routes = [healthRouter, authRouter] as const;

for (const route of routes) {
	api.route("/", route);
}
app.route("/", api);
const port = Number(env.PORT ?? 5000);

// logger.info({ port }, "auth service listening");

export default {
	port,
	fetch: app.fetch,
};
