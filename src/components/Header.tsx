import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
} from "@clerk/tanstack-start";
import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";
import { Button } from "./ui/button";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link to="/" className="flex items-center gap-3 group">
					<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
						<Film className="h-5 w-5 text-white" />
					</div>
					<span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
						Movie Tracker
					</span>
				</Link>

				<div className="flex items-center gap-4">
					<SignedOut>
						<SignInButton mode="modal">
							<Button
								variant="outline"
								className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200"
							>
								Sign In
							</Button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton
							appearance={{
								elements: {
									avatarBox: "h-9 w-9 ring-2 ring-cyan-500/30",
								},
							}}
						/>
					</SignedIn>
				</div>
			</div>
		</header>
	);
}
