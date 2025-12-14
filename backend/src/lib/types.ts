import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Schema } from "hono";
import type { User } from "../common/types/index.types";

//biome-ignore lint/style/useConsistentTypeDefinitions : needed here
export interface AppBindings {
	Variables: {
		user: User;
		token: string;
	};
}

//biome-ignore lint/complexity/noBannedTypes : supress this
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
	R,
	AppBindings
>;
