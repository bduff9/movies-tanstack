"use client";

import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/tanstack-start";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const location = useLocation();
	const returnUrl = `${location.pathname}${location.search}`;

	return (
		<>
			<SignedIn>
				<Outlet />
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn
					signInForceRedirectUrl={returnUrl}
					signInFallbackRedirectUrl="/"
				/>
			</SignedOut>
		</>
	);
}
