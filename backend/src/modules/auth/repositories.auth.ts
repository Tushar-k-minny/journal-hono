import { and, eq } from "drizzle-orm";
import db from "../../common/database";
import { sessions, users } from "../../common/database/schema";
import type {
	RegisterUserInput,
	UpdateProfileInput,
} from "../../common/types/index.types";

export const userRepository = {
	async findByEmail(email: string) {
		const [user] = await db.select().from(users).where(eq(users.email, email));
		return user || null;
	},

	async findById(id: string) {
		const [user] = await db.select().from(users).where(eq(users.id, id));
		return user || null;
	},

	async create(payload: RegisterUserInput & { passwordHash: string }) {
		const [newUser] = await db
			.insert(users)
			.values({
				email: payload.email,
				displayName: payload.displayName,
				passwordHash: payload.passwordHash,
			})
			.onConflictDoNothing()
			.returning();
		return newUser;
	},

	async updateProfile(id: string, payload: UpdateProfileInput) {
		const [updatedUser] = await db
			.update(users)
			.set({
				displayName: payload.displayName,
				avatarUrl: payload.avatarUrl ?? null,
			})
			.where(eq(users.id, id))
			.returning();

		return updatedUser || null;
	},

	async createSession(userId: string, token: string, expiresAt: Date) {
		const [session] = await db
			.insert(sessions)
			.values({
				userId,
				token,
				expiresAt,
			})
			.returning();
		return session;
	},

	async validateSession(userId: string, token: string) {
		const [foundToken] = await db
			.select()
			.from(sessions)
			.where(and(eq(sessions.userId, userId), eq(sessions.token, token)));

		if (!foundToken) {
			return false;
		}

		const isExpired = foundToken.expiresAt < new Date();
		return !isExpired;
	},

	async invalidateSession(userId: string, token: string) {
		const result = await db
			.delete(sessions)
			.where(and(eq(sessions.userId, userId), eq(sessions.token, token)));

		return result;
	},
};
