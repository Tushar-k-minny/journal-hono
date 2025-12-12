import { pino } from "pino";
import { env } from "../env";

export const logger = pino({
	timestamp: pino.stdTimeFunctions.isoTime,
	transport: {
		target: "hono-pino/debug-log",
		options: {
			colorize: true,
			colorEnable: true,
		},
	},
	level: env.LOG_LEVEL ?? "info",
});
