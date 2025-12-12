import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";

//biome-ignore lint/style/useConsistentTypeDefinitions : needed here
export interface AppBindings {
	Variables: {
		user: string;
		token: string;
	};
}

//biome-ignore lint/complexity/noBannedTypes : supress this
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;
