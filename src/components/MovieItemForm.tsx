"use client";

import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2, RotateCcw, Save } from "lucide-react";
import type { FC, FormEvent } from "react";
import { useState, useTransition } from "react";

import type {
	ItemCase,
	ItemDigitl,
	ItemFormat,
	ItemStatus,
	MovitemsRow,
	YesNo,
} from "@/db/types";
import { addMovieItem, editMovieItem } from "@/server/functions/movieItems";
import MovieItemPlaceholder from "./MovieItemPlaceholder";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { Textarea } from "./ui/textarea";

type Props = {
	movieItem?: MovitemsRow;
};

const defaultItem: MovitemsRow = {
	ITEMAVAIL: null,
	ITEMCASE: "Plain",
	ITEMDIGITL: "None",
	ITEMFORMAT: "Ultra HD",
	ITEM3D: "N",
	ITEMWATCH: "N",
	ITEMID: 0,
	ITEMNAME: "",
	ITEMNOTES: null,
	ITEMSTATUS: "Owned",
	ITEMURL: "",
	ORDERED: null,
};

const MovieItemForm: FC<Props> = ({ movieItem = defaultItem }) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Form state - use controlled inputs
	const [itemname, setItemname] = useState(movieItem.ITEMNAME);
	const [itemformat, setItemformat] = useState<ItemFormat>(movieItem.ITEMFORMAT);
	const [item3D, setItem3D] = useState<YesNo>(movieItem.ITEM3D);
	const [itemdigitl, setItemdigitl] = useState<ItemDigitl>(movieItem.ITEMDIGITL);
	const [itemcase, setItemcase] = useState<ItemCase>(movieItem.ITEMCASE);
	const [itemstatus, setItemstatus] = useState<ItemStatus>(movieItem.ITEMSTATUS);
	const [itemavail, setItemavail] = useState(
		movieItem.ITEMAVAIL
			? new Date(movieItem.ITEMAVAIL).toISOString().split("T")[0]
			: "",
	);
	const [itemwatch, setItemwatch] = useState<YesNo>(movieItem.ITEMWATCH);
	const [itemurl, setItemurl] = useState(movieItem.ITEMURL);
	const [itemnotes, setItemnotes] = useState(movieItem.ITEMNOTES ?? "");

	const isEditing = movieItem.ITEMID > 0;

	const handleReturn = () => {
		router.history.back();
	};

	const handleReset = () => {
		setItemname(movieItem.ITEMNAME);
		setItemformat(movieItem.ITEMFORMAT);
		setItem3D(movieItem.ITEM3D);
		setItemdigitl(movieItem.ITEMDIGITL);
		setItemcase(movieItem.ITEMCASE);
		setItemstatus(movieItem.ITEMSTATUS);
		setItemavail(
			movieItem.ITEMAVAIL
				? new Date(movieItem.ITEMAVAIL).toISOString().split("T")[0]
				: "",
		);
		setItemwatch(movieItem.ITEMWATCH);
		setItemurl(movieItem.ITEMURL);
		setItemnotes(movieItem.ITEMNOTES ?? "");
		setErrors({});
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const data = {
			itemid: movieItem.ITEMID,
			itemname,
			itemcase,
			itemdigitl,
			item3D,
			itemwatch,
			itemformat,
			itemstatus,
			itemurl,
			itemnotes: itemnotes || null,
			itemavail: itemavail || null,
		};

		// Basic validation
		const newErrors: Record<string, string> = {};
		if (!data.itemname) newErrors.itemname = "Title is required";
		if (!data.itemurl) newErrors.itemurl = "Image URL is required";

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setErrors({});

		startTransition(async () => {
			try {
				if (isEditing) {
					await editMovieItem({ data });
				} else {
					await addMovieItem({ data });
				}
				router.navigate({ to: "/" });
			} catch (_error) {
				setErrors({ form: "Failed to save item. Please try again." });
			}
		});
	};

	return (
		<Card className="bg-slate-900/50 border-slate-800">
			<CardHeader>
				<CardTitle className="text-slate-200">
					{isEditing ? "Edit Movie Item" : "Add New Movie Item"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Form Buttons - Top */}
					<div className="flex gap-3 pb-4 border-b border-slate-800">
						<Button
							type="button"
							variant="outline"
							onClick={handleReturn}
							className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Return
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={handleReset}
							className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Reset
						</Button>
						<Button
							type="submit"
							disabled={isPending}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{isPending ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
								<Save className="w-4 h-4 mr-2" />
							)}
							Save
						</Button>
					</div>

					{errors.form && (
						<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
							{errors.form}
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Title */}
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="itemname" className="text-slate-300">
								Title
							</Label>
							<Input
								id="itemname"
								name="itemname"
								value={itemname}
								onChange={(e) => setItemname(e.target.value)}
								placeholder="Enter movie title"
								className="bg-slate-800 border-slate-700 text-slate-200"
							/>
							{errors.itemname && (
								<p className="text-red-400 text-xs">{errors.itemname}</p>
							)}
						</div>

						{/* Format */}
						<div className="space-y-2">
							<Label htmlFor="itemformat" className="text-slate-300">
								Format
							</Label>
							<Select
								name="itemformat"
								value={itemformat}
								onValueChange={(v) => setItemformat(v as ItemFormat)}
							>
								<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
									<SelectValue placeholder="Select format" />
								</SelectTrigger>
								<SelectContent className="bg-slate-900 border-slate-700">
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
							<Label className="text-slate-300">3D?</Label>
							<RadioGroup
								name="item3D"
								value={item3D}
								onValueChange={(v) => setItem3D(v as YesNo)}
								className="flex gap-6"
							>
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
							<Label htmlFor="itemdigitl" className="text-slate-300">
								Digital Type
							</Label>
							<Select
								name="itemdigitl"
								value={itemdigitl}
								onValueChange={(v) => setItemdigitl(v as ItemDigitl)}
							>
								<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
									<SelectValue placeholder="Select digital type" />
								</SelectTrigger>
								<SelectContent className="bg-slate-900 border-slate-700">
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
							<Label htmlFor="itemcase" className="text-slate-300">
								Case Type
							</Label>
							<Select
								name="itemcase"
								value={itemcase}
								onValueChange={(v) => setItemcase(v as ItemCase)}
							>
								<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
									<SelectValue placeholder="Select case type" />
								</SelectTrigger>
								<SelectContent className="bg-slate-900 border-slate-700">
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
							<Label htmlFor="itemstatus" className="text-slate-300">
								Status
							</Label>
							<Select
								name="itemstatus"
								value={itemstatus}
								onValueChange={(v) => setItemstatus(v as ItemStatus)}
							>
								<SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent className="bg-slate-900 border-slate-700">
									<SelectItem value="Owned">Owned</SelectItem>
									<SelectItem value="Wanted">Wanted</SelectItem>
									<SelectItem value="Selling">Selling</SelectItem>
									<SelectItem value="Waiting">Waiting</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Release Date */}
						<div className="space-y-2">
							<Label htmlFor="itemavail" className="text-slate-300">
								Release Date
							</Label>
							<Input
								id="itemavail"
								name="itemavail"
								type="date"
								value={itemavail}
								onChange={(e) => setItemavail(e.target.value)}
								className="bg-slate-800 border-slate-700 text-slate-200"
							/>
						</div>

						{/* Watched */}
						<div className="space-y-2">
							<Label className="text-slate-300">Watched?</Label>
							<RadioGroup
								name="itemwatch"
								value={itemwatch}
								onValueChange={(v) => setItemwatch(v as YesNo)}
								className="flex gap-6"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="Y"
										id="itemwatch-Y"
										className="border-slate-600"
									/>
									<Label
										htmlFor="itemwatch-Y"
										className="text-slate-400 cursor-pointer"
									>
										Yes
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="N"
										id="itemwatch-N"
										className="border-slate-600"
									/>
									<Label
										htmlFor="itemwatch-N"
										className="text-slate-400 cursor-pointer"
									>
										No
									</Label>
								</div>
							</RadioGroup>
						</div>

						{/* Image URL */}
						<div className="space-y-2">
							<Label htmlFor="itemurl" className="text-slate-300">
								Image URL
							</Label>
							<Input
								id="itemurl"
								name="itemurl"
								value={itemurl}
								onChange={(e) => setItemurl(e.target.value)}
								placeholder="https://..."
								className="bg-slate-800 border-slate-700 text-slate-200"
							/>
							{errors.itemurl && (
								<p className="text-red-400 text-xs">{errors.itemurl}</p>
							)}
						</div>

						{/* Image Preview */}
						<div className="flex items-center justify-center">
							<div className="rounded-lg overflow-hidden bg-slate-800 p-2">
								{itemurl ? (
									<img
										alt={`Cover for ${itemname}`}
										src={itemurl}
										className="h-36 w-auto object-contain rounded"
										onError={(e) => {
											e.currentTarget.style.display = "none";
										}}
									/>
								) : (
									<MovieItemPlaceholder title={itemname || "Preview"} />
								)}
							</div>
						</div>

						{/* Notes */}
						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="itemnotes" className="text-slate-300">
								Notes
							</Label>
							<Textarea
								id="itemnotes"
								name="itemnotes"
								value={itemnotes}
								onChange={(e) => setItemnotes(e.target.value)}
								placeholder="Add any notes..."
								className="bg-slate-800 border-slate-700 text-slate-200 min-h-[100px]"
							/>
						</div>
					</div>

					{/* Form Buttons - Bottom */}
					<div className="flex gap-3 pt-4 border-t border-slate-800">
						<Button
							type="button"
							variant="outline"
							onClick={handleReturn}
							className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Return
						</Button>
						<Button
							type="button"
							variant="outline"
							disabled={isPending}
							onClick={handleReset}
							className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300"
						>
							<RotateCcw className="w-4 h-4 mr-2" />
							Reset
						</Button>
						<Button
							type="submit"
							disabled={isPending}
							className="bg-cyan-600 hover:bg-cyan-700 text-white"
						>
							{isPending ? (
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							) : (
								<Save className="w-4 h-4 mr-2" />
							)}
							Save
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default MovieItemForm;
