import { createRoute } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import createApp from "@/lib/create-app";

const healthRouter = createApp().openapi(
	createRoute({
		path: "/healthz",
		method: "get",
		tags: ["HealthCheck"],
		summary: "Health check",
		description: "Returns a 200 status code if the server is running",
		responses: {
			200: jsonContent(
				createMessageObjectSchema("App is running fine "),
				"App Health Check"
			),
		},
	}),
	(c) =>
		c.json(
			{
				message: "Auth API is running fine",
			},
			200
		)
);

export default healthRouter;
