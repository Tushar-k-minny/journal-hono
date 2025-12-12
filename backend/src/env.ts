import z from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().min(1).max(9999).default(5000),
	LOG_LEVEL: z
		.enum(["trace", "debug", "info", "warn", "error", "fatal"])
		.default("info"),
	NODE_ENV: z.string().default("development"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (parsedEnv.error) {
	const error = z.flattenError(parsedEnv.error);
	throw new Error(`Invalid environment variables: ${error}`);
}

export const env = parsedEnv.data;
export type env = typeof env;
