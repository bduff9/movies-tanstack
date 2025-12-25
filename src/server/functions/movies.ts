import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db";
import type { MoviesRow } from "@/db/types";
import { requireAdmin } from "@/lib/auth";

export const getMoviesForItem = createServerFn({ method: "GET" })
	.inputValidator((d: { itemId: number }) => d)
	.handler(async (ctx) => {
		const { itemId } = ctx.data;

		return Sentry.startSpan({ name: "getMoviesForItem" }, async () => {
			const movies = await db
				.selectFrom("movies")
				.selectAll()
				.where("ITEMID", "=", itemId)
				.execute();

			return movies as MoviesRow[];
		});
	});

type AddMovieData = {
	itemid: number;
	movietitle: string;
	movieurl: string;
};

export const addMovie = createServerFn({ method: "POST" })
	.inputValidator((d: AddMovieData) => d)
	.handler(async (ctx) => {
		const data = ctx.data;

		return Sentry.startSpan({ name: "addMovie" }, async () => {
			await requireAdmin();

			const result = await db
				.insertInto("movies")
				.values({
					ITEMID: data.itemid,
					MOVIETITLE: data.movietitle,
					MOVIEURL: data.movieurl,
				})
				.executeTakeFirst();

			return { success: true, insertId: Number(result.insertId) };
		});
	});

type DeleteMovieData = {
	movieid: number;
};

export const deleteMovie = createServerFn({ method: "POST" })
	.inputValidator((d: DeleteMovieData) => d)
	.handler(async (ctx) => {
		const { movieid } = ctx.data;

		return Sentry.startSpan({ name: "deleteMovie" }, async () => {
			await requireAdmin();

			await db.deleteFrom("movies").where("MOVIEID", "=", movieid).execute();

			return { success: true };
		});
	});
