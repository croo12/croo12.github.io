import { queryOptions } from "@tanstack/react-query";

export const createWasmLoader = <T>(name: string, initFn: () => Promise<T>) => {
	let cached: Promise<T> | null = null;

	return queryOptions({
		queryKey: ["wasm", name] as const,
		queryFn: () => {
			if (!cached) cached = initFn();
			return cached;
		},
		staleTime: Number.POSITIVE_INFINITY,
		retry: false,
	});
};
