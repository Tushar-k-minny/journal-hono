import { Hono } from "hono";
import { env } from "./env";

const testApp = new Hono();

testApp.get("/", (c) => {
	console.log(process.isBun);
	return c.json({ message: "hello world", environmnet: env.NODE_ENV });
});
// testApp.route("/", app);

export default {
	port: env.PORT,
	fetch: testApp.fetch,
};
