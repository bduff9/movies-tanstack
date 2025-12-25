import { createFileRoute } from "@tanstack/react-router";
import { Film } from "lucide-react";
import MovieItem from "@/components/MovieItem";
import Toolbar from "@/components/Toolbar";
import type { MovitemsRow } from "@/db/types";
import { getMovieItems } from "@/server/functions/movieItems";

type SearchParams = {
	page?: string;
	sort?: "ordered" | "itemid" | "itemname";
	order?: "asc" | "desc";
	itemname?: string;
	itemcase?: string;
	itemdigitl?: string;
	item3D?: string;
	itemformat?: string;
	itemstatus?: string;
};

export const Route = createFileRoute("/_authenticated/")({
	validateSearch: (search: Record<string, unknown>): SearchParams => {
		return {
			page: search.page as string | undefined,
			sort: search.sort as "ordered" | "itemid" | "itemname" | undefined,
			order: search.order as "asc" | "desc" | undefined,
			itemname: search.itemname as string | undefined,
			itemcase: search.itemcase as string | undefined,
			itemdigitl: search.itemdigitl as string | undefined,
			item3D: search.item3D as string | undefined,
			itemformat: search.itemformat as string | undefined,
			itemstatus: search.itemstatus as string | undefined,
		}
	},
	loaderDeps: ({ search }) => search,
	loader: async ({ deps }) => {
		const result = await getMovieItems({
			data: deps as Parameters<typeof getMovieItems>[0]["data"],
		})
		return result;
	},
	component: HomePage,
});

function HomePage() {
	const { maxPage, movieItems, page, total } = Route.useLoaderData();
	const searchParams = Route.useSearch();

	return (
		<div className="min-h-screen">
			<Toolbar
				maxPage={maxPage}
				page={page}
				searchParams={searchParams as Record<string, string | undefined>}
			/>

			<div className="container mx-auto px-4 py-8">
				{/* Results count */}
				<div className="mb-6 flex items-center gap-2 text-slate-400 text-sm">
					<Film className="w-4 h-4" />
					<span>
						{total} {total === 1 ? "item" : "items"} found
					</span>
				</div>

				{movieItems.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20">
						<div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
							<Film className="w-10 h-10 text-slate-600" />
						</div>
						<h2 className="text-xl font-semibold text-slate-300 mb-2">
							No movies found
						</h2>
						<p className="text-slate-500">
							Try adjusting your filters or add a new item
						</p>
					</div>
				) : (
					<div className="flex flex-wrap gap-4 justify-center lg:justify-start">
						{movieItems.map((item: MovitemsRow) => (
							<MovieItem item={item} key={`movie-item-${item.ITEMID}`} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}
