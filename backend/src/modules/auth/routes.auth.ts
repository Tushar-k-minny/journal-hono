import { createRoute } from "@hono/zod-openapi";
//biome-ignore lint/performance/noNamespaceImport : ignore this
import * as HTTPCODES from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
	createErrorSchema,
	createMessageObjectSchema,
} from "stoker/openapi/schemas";
import { requireAuth } from "@/common/middlewares/require-auth.middlewares";
import {
	authCredentialsSchema,
	authResponseSchema,
	registerUserInput,
	updateProfileInput,
	userSchema,
} from "@/common/types/index.types";

const tags = ["auth"];

export const register = createRoute({
	path: "/register",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(registerUserInput, "Register user"),
	},
	responses: {
		[HTTPCODES.CREATED]: jsonContent(
			authResponseSchema,
			"User registered successfully"
		),
		[HTTPCODES.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(registerUserInput),
			"Invalid user data"
		),
		[HTTPCODES.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Something is wrong in the server"),
			"Internal server error"
		),
	},
});

export const login = createRoute({
	path: "/login",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(authCredentialsSchema, "Login user"),
	},
	responses: {
		[HTTPCODES.OK]: jsonContent(
			authResponseSchema,
			"User logged in successfully"
		),
		[HTTPCODES.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Invalid credentials"),
			"Invalid credentials"
		),
		[HTTPCODES.UNPROCESSABLE_ENTITY]: jsonContent(
			createErrorSchema(authCredentialsSchema),
			"Invalid user data"
		),
		[HTTPCODES.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal server error"),
			"Internal server error"
		),
	},
});

export const logout = createRoute({
	path: "/logout",
	method: "post",
	tags,
	request: {
		body: jsonContentRequired(authCredentialsSchema, "Logout user"),
	},
	middleware: [requireAuth],
	responses: {
		[HTTPCODES.OK]: jsonContent(
			createMessageObjectSchema("User logged out successfully"),
			"User logged out successfully"
		),
		[HTTPCODES.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPCODES.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal server error"),
			"Internal server error"
		),
	},
});

export const profile = createRoute({
	path: "/profile",
	method: "get",
	tags: ["profile"],
	middleware: [requireAuth],
	responses: {
		[HTTPCODES.OK]: jsonContent(
			userSchema,
			"User profile retrieved successfully"
		),
		[HTTPCODES.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),
		[HTTPCODES.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("User not found"),
			"User not found"
		),
	},
});

export const updateProfile = createRoute({
	path: "/profile",
	method: "patch",
	tags: ["profile"],
	middleware: [requireAuth],
	request: {
		body: jsonContentRequired(updateProfileInput, "Update user profile"),
	},
	responses: {
		[HTTPCODES.OK]: jsonContent(
			userSchema,
			"User profile updated successfully"
		),
		[HTTPCODES.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Unauthorized"
		),

		[HTTPCODES.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Failed to update user profile"),
			"Invalid input"
		),
		[HTTPCODES.INTERNAL_SERVER_ERROR]: jsonContent(
			createMessageObjectSchema("Internal server error"),
			"Internal server error"
		),
	},
});

export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;

export type ProfileRoute = typeof profile;
export type UpdateProfileRoute = typeof updateProfile;
