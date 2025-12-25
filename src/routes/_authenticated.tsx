"use client";

import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
} from "@clerk/tanstack-start";
import { Outlet, createFileRoute, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const location = useLocation();

	return (
		<>
			<SignedIn>
				<Outlet />
			</SignedIn>
			<SignedOut>
				<RedirectToSignIn
					signInForceRedirectUrl={location.pathname}
					signInFallbackRedirectUrl="/"
				/>
			</SignedOut>
		</>
	);
}

