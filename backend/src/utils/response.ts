export type ApiSuccess<T> = {
	status: "success";
	data: T;
	meta?: Record<string, unknown>;
};

export type ApiError = {
	status: "error";
	message: string;
	code?: string;
	issues?: Record<string, unknown>[];
};

export const ok = <T>(
	data: T,
	meta?: Record<string, unknown>
): ApiSuccess<T> => ({
	status: "success",
	data,
	meta,
});

export const fail = (
	message: string,
	options: { code?: string; issues?: Record<string, unknown>[] } = {}
): ApiError => ({
	status: "error",
	message,
	...options,
});

export const wrapAsync =
	<Args extends unknown[], Result>(fn: (...args: Args) => Promise<Result>) =>
	async (...args: Args) => {
		try {
			const value = await fn(...args);
			return ok(value);
		} catch (error) {
			return fail(error instanceof Error ? error.message : "Unknown error");
		}
	};
