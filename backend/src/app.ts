import { Hono } from "hono";

const testApp = new Hono();

testApp.get("/", (c) => c.text(process.versions.bun));

export default testApp;
