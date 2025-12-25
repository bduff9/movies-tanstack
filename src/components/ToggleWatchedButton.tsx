"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { FC } from "react";
import { useTransition } from "react";
import { useRouter } from "@tanstack/react-router";
import { toggleWatched } from "@/server/functions/movieItems";

type Props = {
	id: number;
	isWatched: boolean;
};

const ToggleWatchedButton: FC<Props> = ({ id, isWatched }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleToggle = () => {
		startTransition(async () => {
			await toggleWatched({ data: { id } });
			// Invalidate the router to refresh the data
			router.invalidate();
		});
	};

	if (isPending) {
		return (
			<div className="flex items-center justify-center py-3">
				<Loader2 className="w-4 h-4 animate-spin text-slate-400" />
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={handleToggle}
			className={`flex items-center justify-center gap-2 py-3 text-sm transition-colors w-full ${
				isWatched
					? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
					: "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
			}`}
		>
			{isWatched ? (
				<>
					<Eye className="w-4 h-4" />
					Watched
				</>
			) : (
				<>
					<EyeOff className="w-4 h-4" />
					Unwatched
				</>
			)}
		</button>
	);
};

export default ToggleWatchedButton;
