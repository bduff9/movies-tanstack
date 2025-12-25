import { createClerkClient } from "@clerk/backend";
import { AuthStatus, stripPrivateDataFromObject } from "@clerk/backend/internal";
import {
	getRequestHeaders,
	getRequestUrl,
} from "@tanstack/react-start/server";

const ADMIN_EMAIL = "bduff9@gmail.com";

/**
 * Authenticate a request using Clerk's backend SDK directly.
 * This bypasses the @clerk/tanstack-start getAuth which uses vinxi's getEvent()
 * that doesn't work inside TanStack Start server functions.
 */
async function authenticateRequestDirect(request: Request) {
	const secretKey = process.env.CLERK_SECRET_KEY;
	const publishableKey = process.env.VITE_CLERK_PUBLISHABLE_KEY;

	if (!secretKey) {
		throw new Error("CLERK_SECRET_KEY is not set");
	}

	const clerkClient = createClerkClient({
		secretKey,
		publishableKey,
	});

	const requestState = await clerkClient.authenticateRequest(request);

	const hasLocationHeader = requestState.headers.get("location");
	if (hasLocationHeader) {
		throw new Response(null, { status: 307, headers: requestState.headers });
	}

	if (requestState.status === AuthStatus.Handshake) {
		throw new Error("Clerk: unexpected handshake without redirect");
	}

	return stripPrivateDataFromObject(requestState.toAuth());
}

export async function requireAuth() {
	// Get URL and headers separately to create a clean request
	// This avoids body consumption issues with the original request
	const url = getRequestUrl();
	const headers = getRequestHeaders();

	// Create a new Request with just the URL and headers (no body)
	const request = new Request(url.href, {
		method: "GET",
		headers: headers as HeadersInit,
	});

	const auth = await authenticateRequestDirect(request);

	if (!auth.userId) {
		throw new Error("Not signed in");
	}

	return auth;
}

export async function requireAdmin() {
	const auth = await requireAuth();

	if (!auth.userId) {
		throw new Error("Not signed in");
	}

	const secretKey = process.env.CLERK_SECRET_KEY;

	if (!secretKey) {
		throw new Error("CLERK_SECRET_KEY is not set");
	}

	const clerkClient = createClerkClient({ secretKey });
	const user = await clerkClient.users.getUser(auth.userId);

	const isAdmin = user.emailAddresses.some(
		(email: { emailAddress: string }) => email.emailAddress === ADMIN_EMAIL,
	);

	if (!isAdmin) {
		throw new Error("Not an admin");
	}

	return user;
}
