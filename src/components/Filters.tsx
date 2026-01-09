"use client";

import { useRouter } from "@tanstack/react-router";
import type { FC, FormEvent } from "react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

type Props = {
	filterOpen: boolean;
	searchParams: Record<string, string | undefined>;
};

const Filters: FC<Props> = ({ filterOpen, searchParams }) => {
	const router = useRouter();
	const formRef = useRef<HTMLFormElement>(null);

	if (!filterOpen) {
		return null;
	}

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const filters: Record<string, string> = {};

		for (const [key, value] of formData.entries()) {
			if (value && typeof value === "string" && value.trim()) {
				filters[key] = value;
			}
		}

		// Preserve sort/order, reset page
		if (searchParams.sort) filters.sort = searchParams.sort;
		if (searchParams.order) filters.order = searchParams.order;
		filters.page = "1";

		router.navigate({ to: "/", search: filters as Record<string, string> });
	};

	const handleReset = () => {
		formRef.current?.reset();
		const resetSearch: Record<string, string> = { page: "1" };
		if (searchParams.sort) resetSearch.sort = searchParams.sort;
		if (searchParams.order) resetSearch.order = searchParams.order;
		router.navigate({ to: "/", search: resetSearch });
	};

	return (
		<div className="mt-4 p-6 rounded-xl border border-slate-700 bg-slate-900/50 backdrop-blur-sm">
			<form ref={formRef} onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="itemname" className="text-slate-300 font-medium">
							Title contains
						</Label>
						<Input
							id="itemname"
							name="itemname"
							defaultValue={searchParams.itemname}
							placeholder="Search titles..."
							className="bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-500"
						/>
					</div>

					{/* Format */}
					<div className="space-y-2">
						<Label htmlFor="itemformat" className="text-slate-300 font-medium">
							Format
						</Label>
						<Select
							name="itemformat"
							defaultValue={searchParams.itemformat || ""}
						>
							<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
								<SelectValue placeholder="Select format..." />
							</SelectTrigger>
							<SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
								<SelectItem value="all">All Formats</SelectItem>
								<SelectItem value="Blu-ray">Blu-ray</SelectItem>
								<SelectItem value="DVD">DVD</SelectItem>
								<SelectItem value="Ultra HD">Ultra HD</SelectItem>
								<SelectItem value="UV">UV</SelectItem>
								<SelectItem value="Digital">Digital</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* 3D */}
					<div className="space-y-2">
						<Label className="text-slate-300 font-medium">3D</Label>
						<RadioGroup
							name="item3D"
							defaultValue={searchParams.item3D || ""}
							className="flex gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value=""
									id="item3D-all"
									className="border-slate-600"
								/>
								<Label
									htmlFor="item3D-all"
									className="text-slate-400 cursor-pointer"
								>
									All
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="Y"
									id="item3D-Y"
									className="border-slate-600"
								/>
								<Label
									htmlFor="item3D-Y"
									className="text-slate-400 cursor-pointer"
								>
									Yes
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="N"
									id="item3D-N"
									className="border-slate-600"
								/>
								<Label
									htmlFor="item3D-N"
									className="text-slate-400 cursor-pointer"
								>
									No
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Digital Type */}
					<div className="space-y-2">
						<Label htmlFor="itemdigitl" className="text-slate-300 font-medium">
							Digital Type
						</Label>
						<Select
							name="itemdigitl"
							defaultValue={searchParams.itemdigitl || ""}
						>
							<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
								<SelectValue placeholder="Select digital type..." />
							</SelectTrigger>
							<SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value="None">None</SelectItem>
								<SelectItem value="DC">Digital Copy</SelectItem>
								<SelectItem value="UV">Ultraviolet</SelectItem>
								<SelectItem value="DC+UV">
									Digital Copy + Ultraviolet
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Case Type */}
					<div className="space-y-2">
						<Label htmlFor="itemcase" className="text-slate-300 font-medium">
							Case Type
						</Label>
						<Select name="itemcase" defaultValue={searchParams.itemcase || ""}>
							<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
								<SelectValue placeholder="Select case type..." />
							</SelectTrigger>
							<SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
								<SelectItem value="all">All Cases</SelectItem>
								<SelectItem value="Plain">Plain</SelectItem>
								<SelectItem value="Box">Box</SelectItem>
								<SelectItem value="Digibook">Digibook</SelectItem>
								<SelectItem value="Slipcover">Slipcover</SelectItem>
								<SelectItem value="Steelbook">Steelbook</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Status */}
					<div className="space-y-2">
						<Label htmlFor="itemstatus" className="text-slate-300 font-medium">
							Status
						</Label>
						<Select
							name="itemstatus"
							defaultValue={searchParams.itemstatus || ""}
						>
							<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
								<SelectValue placeholder="Select status..." />
							</SelectTrigger>
							<SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
								<SelectItem value="all">All Statuses</SelectItem>
								<SelectItem value="Owned">Owned</SelectItem>
								<SelectItem value="Wanted">Wanted</SelectItem>
								<SelectItem value="Selling">Selling</SelectItem>
								<SelectItem value="Waiting">Waiting</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="flex gap-3 mt-6 pt-4 border-t border-slate-800">
					<Button
						type="button"
						variant="outline"
						onClick={handleReset}
						className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
					>
						Reset
					</Button>
					<Button
						type="submit"
						className="bg-cyan-600 hover:bg-cyan-700 text-white"
					>
						Apply Filters
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Filters;
