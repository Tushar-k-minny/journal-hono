//biome-ignore lint/performance/noNamespaceImport :ignore this
import * as HTTPSCODE from "stoker/http-status-codes";
//biome-ignore lint/performance/noNamespaceImport :ignore this
import * as HTTPSPHRASE from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../lib/types";
import type {
	LoginRoute,
	LogoutRoute,
	ProfileRoute,
	RegisterRoute,
	UpdateProfileRoute,
} from "./routes.auth";
import { authService } from "./services.auth";

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
	const payload = c.req.valid("json");

	try {
		const response = await authService.register(payload);
		return c.json(response, HTTPSCODE.CREATED);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal server error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
	const { email, password } = c.req.valid("json");

	try {
		const response = await authService.login({ email, password });
		return c.json(response, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		if (error instanceof Error && error.message === "Invalid credentials") {
			return c.json(
				{ message: HTTPSPHRASE.UNAUTHORIZED },
				HTTPSCODE.UNAUTHORIZED
			);
		}
		return c.json(
			{ message: HTTPSPHRASE.INTERNAL_SERVER_ERROR },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
	const user = c.var.user;
	const token = c.var.token;
	try {
		await authService.logout(user.id, token);
		return c.json({ message: "Logout successful" }, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: HTTPSPHRASE.INTERNAL_SERVER_ERROR },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};

export const profile: AppRouteHandler<ProfileRoute> = async (c) =>
	c.json(c.var.user, HTTPSCODE.OK);

export const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
	const payload = c.req.valid("json");
	if (Object.entries(payload).length === 0) {
		return c.json({ message: "No data provided" }, HTTPSCODE.BAD_REQUEST);
	}
	const user = c.var.user;
	try {
		const response = await authService.updateProfile(user.id, payload);
		return c.json(response, HTTPSCODE.OK);
	} catch (error) {
		console.error(error);
		return c.json(
			{ message: "Internal server error" },
			HTTPSCODE.INTERNAL_SERVER_ERROR
		);
	}
};
