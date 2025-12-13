import { Hono } from "hono";
import { env } from "./env";
import app from "./index";

const testApp = new Hono();

testApp.get("/", (c) => {
	console.log(process.isBun);
	return c.json({ message: "hello world", environmnet: env.NODE_ENV });
});
testApp.route("/", app);

export default testApp;
