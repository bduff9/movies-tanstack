"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import type { FC, FormEvent } from "react";
import { useState, useTransition } from "react";

import type { MoviesRow } from "@/db/types";
import { addMovie, deleteMovie } from "@/server/functions/movies";
import MovieItemPlaceholder from "./MovieItemPlaceholder";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
	movieItemId: number;
	initialMovies: MoviesRow[];
};

const MovieItemMoviesContainer: FC<Props> = ({
	movieItemId,
	initialMovies,
}) => {
	const [movies, setMovies] = useState(initialMovies);
	const [isPending, startTransition] = useTransition();
	const [deletingId, setDeletingId] = useState<number | null>(null);

	const handleAddMovie = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const movietitle = formData.get("movietitle") as string;
		const movieurl = formData.get("movieurl") as string;

		if (!movietitle || !movieurl) return;

		startTransition(async () => {
			const result = await addMovie({
				data: {
					itemid: movieItemId,
					movietitle,
					movieurl,
				},
			});

			if (result.success) {
				// Add the new movie to local state
				setMovies((prev) => [
					...prev,
					{
						MOVIEID: result.insertId,
						ITEMID: movieItemId,
						MOVIETITLE: movietitle,
						MOVIEURL: movieurl,
					},
				]);
				// Reset form
				(e.target as HTMLFormElement).reset();
			}
		});
	};

	const handleDeleteMovie = (movieid: number) => {
		setDeletingId(movieid);
		startTransition(async () => {
			const result = await deleteMovie({ data: { movieid } });

			if (result.success) {
				setMovies((prev) => prev.filter((m) => m.MOVIEID !== movieid));
			}
			setDeletingId(null);
		});
	};

	return (
		<Card className="bg-slate-900/50 border-slate-800 mt-6">
			<CardHeader>
				<CardTitle className="text-slate-200 text-lg">
					Movies in this Item
				</CardTitle>
			</CardHeader>
			<CardContent>
				{movies.length > 0 ? (
					<div className="flex flex-wrap gap-4 mb-6">
						{movies.map((movie) => (
							<div
								key={`movie-${movie.MOVIEID}`}
								className="w-28 text-center group"
							>
								<div className="rounded-lg overflow-hidden bg-slate-800 p-1 mb-2">
									{movie.MOVIEURL ? (
										<img
											alt={`Cover for ${movie.MOVIETITLE}`}
											src={movie.MOVIEURL}
											className="w-full h-auto rounded"
										/>
									) : (
										<MovieItemPlaceholder title={movie.MOVIETITLE ?? ""} />
									)}
								</div>
								<p
									className="text-xs text-slate-400 truncate mb-2"
									title={movie.MOVIETITLE ?? ""}
								>
									{movie.MOVIETITLE}
								</p>
								<Button
									variant="ghost"
									size="sm"
									disabled={deletingId === movie.MOVIEID}
									onClick={() => handleDeleteMovie(movie.MOVIEID)}
									className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-500/10"
								>
									{deletingId === movie.MOVIEID ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Trash2 className="w-4 h-4" />
									)}
								</Button>
							</div>
						))}
					</div>
				) : (
					<p className="text-slate-500 text-sm mb-6">No movies added yet</p>
				)}

				{/* Add Movie Form */}
				<form
					onSubmit={handleAddMovie}
					className="border-t border-slate-800 pt-6"
				>
					<h4 className="text-sm font-medium text-slate-300 mb-4">
						Add New Movie
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
						<div className="space-y-2">
							<Label htmlFor="movietitle" className="text-slate-400 text-sm">
								Movie Title
							</Label>
							<Input
								id="movietitle"
								name="movietitle"
								required
								placeholder="Enter movie title"
								className="bg-slate-800 border-slate-700 text-slate-200"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="movieurl" className="text-slate-400 text-sm">
								Image URL
							</Label>
							<Input
								id="movieurl"
								name="movieurl"
								required
								placeholder="https://..."
								className="bg-slate-800 border-slate-700 text-slate-200"
							/>
						</div>
					</div>
					<Button
						type="submit"
						disabled={isPending}
						className="bg-cyan-600 hover:bg-cyan-700 text-white"
					>
						{isPending ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<Plus className="w-4 h-4 mr-2" />
						)}
						Add Movie
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default MovieItemMoviesContainer;
