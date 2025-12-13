import { Hono } from "hono";
import { env } from "./env";
import configureOpenAPI from "./lib/configure-open-api-app";
import createApp from "./lib/create-app";

const testApp = new Hono();
const api = createApp();
configureOpenAPI(api);

testApp.get("/", (c) => {
	console.log(process.isBun);
	return c.json({ message: "hello world", environmnet: env.NODE_ENV });
});

api.get("/api", (c) => c.text("Hello from API"));
testApp.route("/", api);
// testApp.route("/", app);

export default {
	port: env.PORT,
	fetch: testApp.fetch,
};
