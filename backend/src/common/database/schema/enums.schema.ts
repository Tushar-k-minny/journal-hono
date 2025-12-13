import { pgEnum } from "drizzle-orm/pg-core";

export const moodEnum = pgEnum("mood", [
	"joyful",
	"content",
	"neutral",
	"anxious",
	"stressed",
	"sad",
	"angry",
]);

export type Mood = (typeof moodEnum.enumValues)[number];
