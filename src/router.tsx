import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

/**
 * Default TanStack search parsing uses JSON coercions and non-stable key ordering.
 * On SSR, the router issues a redirect when the raw URL does not match the canonical
 * serialized search; that check can loop on every request for some query strings.
 * Plain string values and sorted keys make canonicalization stable.
 */
function parseSearch(searchStr: string): Record<string, string> {
	const trimmed = searchStr.startsWith("?") ? searchStr.slice(1) : searchStr;
	const params = new URLSearchParams(trimmed);
	const keys = [...new Set(params.keys())].sort((a, b) => a.localeCompare(b));
	const result: Record<string, string> = {};
	for (const key of keys) {
		const value = params.get(key);
		if (value !== null) {
			result[key] = value;
		}
	}
	return result;
}

function stringifySearch(search: Record<string, unknown>): string {
	const keys = Object.keys(search)
		.filter((key) => search[key] !== undefined)
		.sort((a, b) => a.localeCompare(b));
	const params = new URLSearchParams();
	for (const key of keys) {
		params.set(key, String(search[key]));
	}
	const serialized = params.toString();
	return serialized ? `?${serialized}` : "";
}

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: {
			...rqContext,
		},

		defaultPreload: "intent",
		parseSearch,
		stringifySearch,
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	if (!router.isServer) {
		Sentry.init({
			dsn: import.meta.env.VITE_SENTRY_DSN,
			integrations: [],
			tracesSampleRate: 1.0,
			sendDefaultPii: true,
		});
	}

	return router;
};
