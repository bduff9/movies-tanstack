"use client";

import { Link, useRouter } from "@tanstack/react-router";
import {
	ArrowDown01,
	ArrowDownAZ,
	ArrowUp10,
	ArrowUpDown,
	ArrowUpZA,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Plus,
	Search,
	X,
} from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import Filters from "./Filters";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";

type SortOption = "ordered" | "itemid" | "itemname";
type OrderDirection = "asc" | "desc";

type Props = {
	maxPage: number;
	page: number;
	searchParams: Record<string, string | undefined>;
};

const Toolbar: FC<Props> = ({ maxPage, page, searchParams }) => {
	const [filterOpen, setFilterOpen] = useState<boolean>(false);
	const router = useRouter();
	const { sort, order } = searchParams as {
		sort?: SortOption;
		order?: OrderDirection;
	};

	const handlePageChange = (newPage: number) => {
		router.navigate({
			to: "/",
			search: { ...searchParams, page: String(newPage) },
		});
	};

	const handleSortChange = (newSort: SortOption) => {
		const newOrder = sort === newSort && order === "desc" ? "asc" : "desc";
		router.navigate({
			to: "/",
			search: { ...searchParams, sort: newSort, order: newOrder },
		});
	};

	const getSortIcon = (sortField: SortOption, isNumeric: boolean) => {
		if (sort !== sortField) return null;
		const iconClass = "inline w-4 h-4 ml-1";
		if (isNumeric) {
			return order === "asc" ? (
				<ArrowDown01 className={iconClass} />
			) : (
				<ArrowUp10 className={iconClass} />
			);
		}
		return order === "asc" ? (
			<ArrowDownAZ className={iconClass} />
		) : (
			<ArrowUpZA className={iconClass} />
		);
	};

	return (
		<div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3">
			<div className="container mx-auto">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					{/* Pagination */}
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							disabled={page <= 1}
							onClick={() => handlePageChange(1)}
							className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
						>
							<ChevronsLeft className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={page <= 1}
							onClick={() => handlePageChange(page - 1)}
							className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
						>
							<ChevronLeft className="w-5 h-5" />
						</Button>

						<div className="flex items-center gap-2 px-2">
							<Input
								type="number"
								value={page}
								min={1}
								max={maxPage}
								onChange={(e) => {
									const val = Number.parseInt(e.target.value, 10);
									if (val >= 1 && val <= maxPage) handlePageChange(val);
								}}
								className="w-16 h-9 text-center bg-slate-800 border-slate-700 text-slate-200"
							/>
							<span className="text-slate-500 text-sm">of {maxPage}</span>
						</div>

						<Button
							variant="ghost"
							size="icon"
							disabled={page >= maxPage}
							onClick={() => handlePageChange(page + 1)}
							className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
						>
							<ChevronRight className="w-5 h-5" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							disabled={page >= maxPage}
							onClick={() => handlePageChange(maxPage)}
							className="h-9 w-9 text-slate-400 hover:text-white disabled:opacity-30"
						>
							<ChevronsRight className="w-5 h-5" />
						</Button>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<Link to="/item/add">
							<Button
								variant="default"
								size="sm"
								className="bg-cyan-600 hover:bg-cyan-700 text-white"
							>
								<Plus className="w-4 h-4 mr-1" />
								Add Item
							</Button>
						</Link>

						<Button
							variant={filterOpen ? "secondary" : "outline"}
							size="sm"
							onClick={() => setFilterOpen((open) => !open)}
							className={cn(
								"border-slate-700",
								filterOpen
									? "bg-cyan-600 text-white hover:bg-cyan-700"
									: "bg-slate-800/50 hover:bg-slate-800 text-slate-300",
							)}
						>
							{filterOpen ? (
								<X className="w-4 h-4 mr-1" />
							) : (
								<Search className="w-4 h-4 mr-1" />
							)}
							Filter
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
								>
									<ArrowUpDown className="w-4 h-4 mr-1" />
									Sort
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="bg-slate-900 border-slate-700 text-white"
							>
								<DropdownMenuItem
									onClick={() => handleSortChange("ordered")}
									className={cn(
										"cursor-pointer",
										sort === "ordered" && "bg-slate-800 text-cyan-400",
									)}
								>
									Watch Order
									{getSortIcon("ordered", true)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleSortChange("itemid")}
									className={cn(
										"cursor-pointer",
										sort === "itemid" && "bg-slate-800 text-cyan-400",
									)}
								>
									ID
									{getSortIcon("itemid", true)}
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleSortChange("itemname")}
									className={cn(
										"cursor-pointer",
										sort === "itemname" && "bg-slate-800 text-cyan-400",
									)}
								>
									Title
									{getSortIcon("itemname", false)}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<Filters filterOpen={filterOpen} searchParams={searchParams} />
			</div>
		</div>
	);
};

export default Toolbar;
