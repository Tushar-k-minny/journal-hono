import { Hono } from "hono";

const testApp = new Hono();

testApp.get("/", (c) => {
	console.log(process.isBun);
	return c.text("hello world");
});

export default testApp;
