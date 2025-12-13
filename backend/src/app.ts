import createApp from "./lib/create-app";

const testApp = createApp();

testApp.get("/", (c) => c.text(process.versions.bun));

export default testApp;
