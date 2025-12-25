import { createFileRoute } from "@tanstack/react-router";
import MovieItemForm from "@/components/MovieItemForm";
import MovieItemMoviesContainer from "@/components/MovieItemMoviesContainer";
import { getMovieItem } from "@/server/functions/movieItems";
import { getMoviesForItem } from "@/server/functions/movies";

export const Route = createFileRoute("/_authenticated/item/$itemId")({
	head: () => ({
		meta: [{ title: "Edit Movie Item | Movie Tracker" }],
	}),
	loader: async ({ params }) => {
		const itemId = Number.parseInt(params.itemId);

		const [movieItem, movies] = await Promise.all([
			getMovieItem({ data: { itemId } }),
			getMoviesForItem({ data: { itemId } }),
		])

		return { movieItem, movies };
	},
	component: EditPage,
});

function EditPage() {
	const { movieItem, movies } = Route.useLoaderData();

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<MovieItemForm movieItem={movieItem} />
			<MovieItemMoviesContainer
				movieItemId={movieItem.ITEMID}
				initialMovies={movies}
			/>
		</div>
	)
}
