import { password } from "bun";
import { sign, verify as verifyJWT } from "hono/jwt";
import ms, { type StringValue } from "ms";
import type { User as DbUser } from "../../common/database/schema/users.schema";
import type {
	AuthCredentials,
	AuthResponse,
	RegisterUserInput,
	UpdateProfileInput,
	User,
} from "../../common/types/index.types";
import { env as authEnv } from "../../env";
import { userRepository } from "./repositories.auth";

const jwtSecret = authEnv.JWT_SECRET;

const toUserDto = (user: DbUser): User => ({
	id: user.id,
	email: user.email,
	displayName: user.displayName,
	avatarUrl: user.avatarUrl ?? undefined,
	createdAt: user.createdAt.toISOString(),
	updatedAt: user.updatedAt.toISOString(),
});

const buildAuthResponse = async (user: DbUser): Promise<AuthResponse> => {
	const expiresInMs = Date.now() + ms(authEnv.JWT_EXPIRES_IN as StringValue); //milliseconds
	const expiresAt = new Date(expiresInMs);

	const token = await sign(
		{
			userId: user.id,
			email: user.email,
			iat: Math.floor(Date.now() / 1000), //seconds
			exp: Math.floor(expiresInMs / 1000), //seconds
		},
		jwtSecret,
		"HS256"
	);

	return {
		token,
		expiresAt: expiresAt.toISOString(),
		user: toUserDto(user),
	};
};

export const authService = {
	async register(payload: RegisterUserInput): Promise<AuthResponse> {
		// const existing = await userRepository.findByEmail(payload.email);

		// if (existing) {
		//   throw new Error('Email is already registered');
		// }

		try {
			const passwordHash = await password.hash(payload.password);
			const created = await userRepository.create({ ...payload, passwordHash });
			if (!created) {
				throw new Error("Something went wrong while registering");
			}
			return buildAuthResponse(created);
		} catch (error) {
			// Check if error is due to unique constraint violation
			// Postgres error code for unique_violation is 23505
			// biome-ignore lint:lint/suspicious/noExplicitAny needed
			if ((error as any)?.code === "23505") {
				throw new Error("Email is already registered");
			}

			throw new Error("Something went wrong while registering");
		}
	},

	async login(credentials: AuthCredentials): Promise<AuthResponse> {
		const user = await userRepository.findByEmail(credentials.email);

		if (!user) {
			throw new Error("Invalid credentials");
		}

		const isValid = await password.verify(
			credentials.password,
			user.passwordHash
		);

		if (!isValid) {
			throw new Error("Invalid credentials");
		}

		return buildAuthResponse(user);
	},

	async verify(token: string) {
		const result = await verifyJWT(token, authEnv.JWT_SECRET, "HS256");

		if (!result) {
			throw new Error("Invalid token");
		}

		const userId = result?.userId;

		if (!userId || typeof userId !== "string") {
			throw new Error("Invalid token payload");
		}

		const user = await userRepository.findById(userId);

		if (!user) {
			throw new Error("User no longer exists");
		}

		return toUserDto(user);
	},

	async updateProfile(userId: string, payload: UpdateProfileInput) {
		const user = await userRepository.updateProfile(userId, payload);

		if (!user) {
			throw new Error("User not found");
		}

		return toUserDto(user);
	},

	async logout(userId: string, token: string) {
		await userRepository.invalidateSession(userId, token);
	},
};
