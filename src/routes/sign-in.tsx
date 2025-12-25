"use client";

import { SignIn } from "@clerk/tanstack-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
	head: () => ({
		meta: [{ title: "Sign In | Movie Tracker" }],
	}),
	component: SignInPage,
});

function SignInPage() {
	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
			<SignIn
				routing="hash"
				forceRedirectUrl="/"
				appearance={{
					elements: {
						rootBox: "mx-auto",
						card: "bg-slate-900 border-slate-800 shadow-xl",
						headerTitle: "text-slate-100",
						headerSubtitle: "text-slate-400",
						socialButtonsBlockButton:
							"border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200",
						socialButtonsBlockButtonText: "text-slate-200",
						dividerLine: "bg-slate-700",
						dividerText: "text-slate-400",
						formFieldLabel: "text-slate-300",
						formFieldInput:
							"bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500",
						formButtonPrimary: "bg-cyan-600 hover:bg-cyan-700",
						footerActionLink: "text-cyan-400 hover:text-cyan-300",
					},
				}}
			/>
		</div>
	);
}
