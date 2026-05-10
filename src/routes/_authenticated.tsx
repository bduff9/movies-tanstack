"use client";

import { RedirectToSignIn, Show } from "@clerk/react";
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

/** `location.search` is a parsed object — stringify like `router.tsx` for a valid return URL. */
function stringifyLocationSearch(search: Record<string, unknown>): string {
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

export const Route = createFileRoute("/_authenticated")({
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const location = useLocation();
	const returnUrl = `${location.pathname}${stringifyLocationSearch(location.search as Record<string, unknown>)}`;

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
