"use client";

import { useAuth, useClerk } from "@clerk/react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { isLoaded, userId } = useAuth();
	const clerk = useClerk();
	const location = useLocation();
	const returnUrl = `${location.pathname}${location.search}`;
	const redirectIssuedForUrl = useRef<string | null>(null);

	useEffect(() => {
		if (!isLoaded || userId) {
			redirectIssuedForUrl.current = null;
			return;
		}
		if (redirectIssuedForUrl.current === returnUrl) {
			return;
		}
		redirectIssuedForUrl.current = returnUrl;
		void clerk.redirectToSignIn({
			signInForceRedirectUrl: returnUrl,
			signInFallbackRedirectUrl: "/",
		});
	}, [clerk, isLoaded, returnUrl, userId]);

	if (!isLoaded) {
		return null;
	}
	if (!userId) {
		return null;
	}
	return <Outlet />;
}
