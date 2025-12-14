import type { Context, Next } from "hono";
import { authService } from "../../modules/auth/services.auth";
import { fail } from "../../utils/response";

export const requireAuth = async (c: Context, next: Next) => {
	const header = c.req.header("authorization");

	if (!header) {
		return c.json(
			fail("Missing authorization header", { code: "UNAUTHORIZED" }),
			401
		);
	}

	const [scheme, token] = header.split(" ");

	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return c.json(
			fail("Invalid authorization header", { code: "UNAUTHORIZED" }),
			401
		);
	}

	try {
		const user = await authService.verify(token);
		c.set("user", user);
		c.set("token", token);
		return await next();
	} catch (error) {
		console.error(error);
		return c.json(
			fail("Unauthorized", {
				code: "UNAUTHORIZED",
			}),
			401
		);
	}
};
