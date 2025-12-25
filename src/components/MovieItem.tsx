"use client";
import { Link } from "@tanstack/react-router";
import {
	Banknote,
	Book,
	Box,
	Brackets,
	Check,
	ClipboardList,
	Pencil,
	Square,
	Truck,
} from "lucide-react";
import type { FC, ReactNode } from "react";
import type {
	ItemCase,
	ItemFormat,
	ItemStatus,
	MovitemsRow,
	YesNo,
} from "@/db/types";
import { getFormattedDate } from "@/lib/date";
import MovieItemPlaceholder from "./MovieItemPlaceholder";
import ToggleWatchedButton from "./ToggleWatchedButton";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

const getFormatImage = (format: ItemFormat, is3D: YesNo): string => {
	const formatName = format.replace(/[\s-]/g, "");
	const suffix = is3D === "Y" ? "3D" : "";
	// Use SVG for Ultra HD (better contrast on dark backgrounds)
	const ext = formatName === "UltraHD" ? "svg" : "png";
	return `/images/${formatName}${suffix}.${ext}`;
};

const getCaseIcon = (caseType: ItemCase): ReactNode => {
	const iconClass = "w-4 h-4";
	switch (caseType) {
		case "Box":
			return <Box className={`${iconClass} text-amber-400`} />;
		case "Digibook":
			return <Book className={`${iconClass} text-cyan-400`} />;
		case "Plain":
			return <Square className={`${iconClass} text-slate-400`} />;
		case "Slipcover":
			return <Brackets className={`${iconClass} text-purple-400`} />;
		case "Steelbook":
			return <Book className={`${iconClass} text-slate-500`} />;
		default:
			return null;
	}
};

const getStatusIcon = (status: ItemStatus): ReactNode => {
	const iconClass = "w-4 h-4";
	switch (status) {
		case "Owned":
			return <Check className={`${iconClass} text-emerald-400`} />;
		case "Selling":
			return <Banknote className={`${iconClass} text-green-500`} />;
		case "Waiting":
			return <Truck className={`${iconClass} text-amber-400`} />;
		case "Wanted":
			return <ClipboardList className={`${iconClass} text-blue-400`} />;
		default:
			return null;
	}
};

type Props = {
	item: MovitemsRow;
};

const MovieItem: FC<Props> = ({ item }) => {
	const digitl = item.ITEMDIGITL as string;

	return (
		<Card className="w-[220px] bg-slate-900/50 border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5 group overflow-hidden">
			<CardHeader className="pb-2 pt-4 px-4">
				<h3
					className="font-semibold text-slate-200 truncate text-sm group-hover:text-cyan-300 transition-colors"
					title={item.ITEMNAME}
				>
					{item.ITEMNAME}
				</h3>
			</CardHeader>

			<CardContent className="px-4 pb-4">
				<div className="flex justify-center mb-4 rounded-lg overflow-hidden bg-slate-800/50 p-2">
					{item.ITEMURL ? (
						<img
							alt={`Cover for ${item.ITEMNAME}`}
							src={item.ITEMURL}
							className="h-36 w-auto object-contain rounded"
						/>
					) : (
						<MovieItemPlaceholder title={item.ITEMNAME} />
					)}
				</div>

				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<img
							src={getFormatImage(item.ITEMFORMAT, item.ITEM3D)}
							alt={item.ITEMFORMAT}
							width={44}
							height={44}
							className="rounded"
						/>
					</div>

					<div className="grid grid-cols-2 gap-2 flex-1">
						<div className="flex items-center justify-center h-6 rounded bg-slate-800/80 px-2">
							{digitl.includes("UV") && (
								<span className="text-xs font-bold text-purple-400">UV</span>
							)}
						</div>
						<div className="flex items-center justify-center h-6 rounded bg-slate-800/80 px-2">
							{digitl.includes("DC") && (
								<span className="text-xs font-bold text-cyan-400">DC</span>
							)}
						</div>
						<div
							className="flex items-center justify-center h-6 rounded bg-slate-800/80"
							title={item.ITEMCASE}
						>
							{getCaseIcon(item.ITEMCASE)}
						</div>
						<div
							className="flex items-center justify-center h-6 rounded bg-slate-800/80"
							title={item.ITEMSTATUS}
						>
							{getStatusIcon(item.ITEMSTATUS)}
						</div>
					</div>
				</div>

				{item.ITEMAVAIL && (
					<p className="mt-3 text-xs text-slate-500 text-center">
						{getFormattedDate(item.ITEMAVAIL)}
					</p>
				)}
			</CardContent>

			<CardFooter className="border-t border-slate-800 p-0">
				<div className="grid grid-cols-2 divide-x divide-slate-800 w-full">
					<Link
						to="/item/$itemId"
						params={{ itemId: String(item.ITEMID) }}
						className="flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
					>
						<Pencil className="w-4 h-4" />
						Edit
					</Link>
					<ToggleWatchedButton
						isWatched={item.ITEMWATCH === "Y"}
						id={item.ITEMID}
					/>
				</div>
			</CardFooter>
		</Card>
	);
};

export default MovieItem;
