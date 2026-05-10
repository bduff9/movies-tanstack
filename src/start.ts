import { clerkMiddleware } from "@clerk/tanstack-react-start/server";
import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
	requestMiddleware: [
		clerkMiddleware(({ url }) => ({
			authorizedParties: [url.origin],
			signInUrl: `${url.origin}/sign-in`,
			signUpUrl: `${url.origin}/sign-in`,
		})),
	],
}));
