import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";
import createApp from "../lib/create-app";

const healthRoute = createApp().openapi(
	{
		method: "get",
		path: "/healthz",
		responses: {
			200: jsonContent(createMessageObjectSchema("Healthy"), "Health"),
		},
	},
	(c) => c.json({ message: "Healthy" }, 200)
);

export default healthRoute;
