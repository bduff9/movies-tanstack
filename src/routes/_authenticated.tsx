"use client";

import { RedirectToSignIn, Show } from "@clerk/react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const location = useLocation();
	const returnUrl = `${location.pathname}${location.search}`;

	return (
		<>
			<Show when="signed-in">
				<Outlet />
			</Show>
			<Show when="signed-out">
				<RedirectToSignIn
					signInForceRedirectUrl={returnUrl}
					signInFallbackRedirectUrl="/"
				/>
			</Show>
		</>
	);
}
