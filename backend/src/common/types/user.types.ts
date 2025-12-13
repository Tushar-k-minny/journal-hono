import { z } from "zod";

export const userSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	displayName: z.string().min(1).max(120),
	avatarUrl: z.string().url().optional().nullable(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime(),
});

export const authCredentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(128),
});

export const authResponseSchema = z.object({
	token: z.string(),
	expiresAt: z.string().datetime(),
	user: userSchema,
});

export const registerUserInput = userSchema
	.pick({ email: true, displayName: true })
	.extend({ password: z.string().min(8).max(128) });

export const updateProfileInput = userSchema.pick({
	displayName: true,
	avatarUrl: true,
});

export type User = z.infer<typeof userSchema>;
export type AuthCredentials = z.infer<typeof authCredentialsSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type RegisterUserInput = z.infer<typeof registerUserInput>;
export type UpdateProfileInput = z.infer<typeof updateProfileInput>;
