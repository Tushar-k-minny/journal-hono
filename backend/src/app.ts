import { Hono } from "hono";
import app from "./index";

const testApp = new Hono();

testApp.get("/", (c) => {
	console.log(process.isBun);
	return c.text("hello world");
});
testApp.route("/", app);

export default testApp;
