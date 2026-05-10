import { createClerkClient } from "@clerk/backend";
import {
	AuthStatus,
	debugRequestState,
	stripPrivateDataFromObject,
} from "@clerk/backend/internal";
import { createMiddleware, createStart } from "@tanstack/react-start";

/**
 * Clerk must run authenticateRequest on full document requests so session refresh /
 * handshake can return 307 + Set-Cookie before React renders. Without this, a stale
 * tab refresh can leave SSR and the Clerk client fighting redirects.
 *
 * We only run on typical browser navigations (Sec-Fetch-Mode: navigate) so server
 * function RPC GETs are not turned into 307s.
 */
function shouldRunClerkForRequest(request: Request, pathname: string): boolean {
	if (request.method !== "GET") {
		return false;
	}
	const fnBase = process.env.TSS_SERVER_FN_BASE ?? "/_serverFn";
	if (pathname.startsWith(fnBase)) {
		return false;
	}
	const mode = request.headers.get("sec-fetch-mode");
	if (mode === "navigate") {
		return true;
	}
	// Non-browser clients (curl, probes): still authenticate if they ask for HTML
	if (mode == null) {
		const accept = request.headers.get("accept") ?? "";
		return accept.includes("text/html");
	}
	return false;
}

const clerkRequestMiddleware = createMiddleware({ type: "request" }).server(
	async ({ request, next, pathname }) => {
		if (!shouldRunClerkForRequest(request, pathname)) {
			return next();
		}

		const secretKey = process.env.CLERK_SECRET_KEY;
		const publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY;

		if (!secretKey || !publishableKey) {
			return next();
		}

		const origin = new URL(request.url).origin;
		const clerkClient = createClerkClient({
			secretKey,
			publishableKey,
		});

		const requestState = await clerkClient.authenticateRequest(request, {
			authorizedParties: [origin],
			signInUrl: `${origin}/sign-in`,
			signUpUrl: `${origin}/sign-in`,
		});

		const location = requestState.headers.get("location");
		if (location) {
			return new Response(null, {
				status: 307,
				headers: requestState.headers,
			});
		}

		if (requestState.status === AuthStatus.Handshake) {
			throw new Error("Clerk: unexpected handshake without redirect");
		}

		const clerkInitialState = {
			__internal_clerk_state: {
				__clerk_ssr_state: stripPrivateDataFromObject(requestState.toAuth()),
				__publishableKey: requestState.publishableKey,
				__proxyUrl: requestState.proxyUrl,
				__domain: requestState.domain,
				__isSatellite: requestState.isSatellite,
				__signInUrl: requestState.signInUrl,
				__signUpUrl: requestState.signUpUrl,
				__afterSignInUrl: requestState.afterSignInUrl,
				__afterSignUpUrl: requestState.afterSignUpUrl,
				__clerk_debug: debugRequestState(requestState),
				__clerkJSUrl: process.env.CLERK_JS ?? "",
				__clerkJSVersion: process.env.CLERK_JS_VERSION ?? "",
				__telemetryDisabled: process.env.CLERK_TELEMETRY_DISABLED === "1",
				__telemetryDebug: process.env.CLERK_TELEMETRY_DEBUG === "1",
				__signInForceRedirectUrl:
					process.env.CLERK_SIGN_IN_FORCE_REDIRECT_URL ?? "",
				__signUpForceRedirectUrl:
					process.env.CLERK_SIGN_UP_FORCE_REDIRECT_URL ?? "",
				__signInFallbackRedirectUrl:
					process.env.CLERK_SIGN_IN_FALLBACK_REDIRECT_URL ?? "",
				__signUpFallbackRedirectUrl:
					process.env.CLERK_SIGN_UP_FALLBACK_REDIRECT_URL ?? "",
			},
		};

		return next({
			context: {
				clerkInitialState,
			},
		});
	},
);

export const startInstance = createStart(() => ({
	requestMiddleware: [clerkRequestMiddleware],
}));
