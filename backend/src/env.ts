import z from "zod";

const durationRegex = /^\d+[dhms]$/;

const envSchema = z.object({
	PORT: z.coerce.number().min(1).max(9999).default(5000),

	LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),

	NODE_ENV: z.string().default("development"),

	DATABASE_URL: z.url(),

	JWT_SECRET: z.string().min(32),

	JWT_EXPIRES_IN: z
		.string()
		.default("7d")
		.refine(
			(val) => {
				// Regex to match one or more digits followed by 'd', 'h', 'm', or 's'
				if (durationRegex.test(val)) {
					return true;
				}
				return false;
			},
			{
				message:
					"Invalid JWT_EXPIRES_IN format. Expected format like '7d', '1h', '30m', or '60s'.",
			}
		),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.error) {
	const error = z.flattenError(parsedEnv.error);
	throw new Error(`Invalid environment variables: ${error}`);
}

export const env = parsedEnv.data;
export type env = typeof env;
