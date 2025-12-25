import * as Sentry from "@sentry/tanstackstart-react";
import { createServerFn } from "@tanstack/react-start";
import { sql } from "kysely";

import { db } from "@/db";
import type {
	ItemCase,
	ItemDigitl,
	ItemFormat,
	ItemStatus,
	MovitemsRow,
	YesNo,
} from "@/db/types";
import { requireAdmin } from "@/lib/auth";

const ITEMS_PER_PAGE = 25;

type SearchParams = {
	page?: string;
	sort?: "ordered" | "itemid" | "itemname";
	order?: "asc" | "desc";
	itemname?: string;
	itemcase?: ItemCase | "" | "all";
	itemdigitl?: ItemDigitl | "" | "all";
	item3D?: YesNo | "" | "all";
	itemformat?: ItemFormat | "" | "all";
	itemstatus?: ItemStatus | "" | "all";
};

export const getMovieItems = createServerFn({ method: "GET" })
	.inputValidator((d: SearchParams) => d)
	.handler(async (ctx) => {
		const searchParams = ctx.data;

		return Sentry.startSpan({ name: "getMovieItems" }, async () => {
			const sortDir = searchParams.order === "asc" ? "asc" : "desc";

			let query = db.selectFrom("movitems").selectAll();
			let countQuery = db
				.selectFrom("movitems")
				.select(sql<number>`count(*)`.as("count"));

			// Apply filters
			if (searchParams.itemname) {
				query = query.where("ITEMNAME", "like", `%${searchParams.itemname}%`);
				countQuery = countQuery.where(
					"ITEMNAME",
					"like",
					`%${searchParams.itemname}%`,
				);
			}

			if (searchParams.itemcase && searchParams.itemcase !== "all") {
				query = query.where("ITEMCASE", "=", searchParams.itemcase);
				countQuery = countQuery.where("ITEMCASE", "=", searchParams.itemcase);
			}

			if (searchParams.itemdigitl && searchParams.itemdigitl !== "all") {
				query = query.where("ITEMDIGITL", "=", searchParams.itemdigitl);
				countQuery = countQuery.where(
					"ITEMDIGITL",
					"=",
					searchParams.itemdigitl,
				);
			}

			if (searchParams.itemformat && searchParams.itemformat !== "all") {
				query = query.where("ITEMFORMAT", "=", searchParams.itemformat);
				countQuery = countQuery.where(
					"ITEMFORMAT",
					"=",
					searchParams.itemformat,
				);
			}

			if (searchParams.item3D && searchParams.item3D !== "all") {
				query = query.where("ITEM3D", "=", searchParams.item3D);
				countQuery = countQuery.where("ITEM3D", "=", searchParams.item3D);
			}

			if (searchParams.itemstatus && searchParams.itemstatus !== "all") {
				query = query.where("ITEMSTATUS", "=", searchParams.itemstatus);
				countQuery = countQuery.where(
					"ITEMSTATUS",
					"=",
					searchParams.itemstatus,
				);
			}

			// Get total count
			const totalResult = await countQuery.executeTakeFirst();
			const total = totalResult?.count ?? 0;
			const maxPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

			// Calculate page
			let page = searchParams.page ? Number.parseInt(searchParams.page) : 1;
			if (page < 1) page = 1;
			if (page > maxPage) page = maxPage;

			// Apply sorting
			const sortField = searchParams.sort || "itemid";
			if (sortField === "ordered") {
				query = query.orderBy("ORDERED", sortDir);
			} else if (sortField === "itemname") {
				query = query.orderBy("ITEMNAME", sortDir);
			} else {
				query = query.orderBy("ITEMID", sortDir);
			}

			// Apply pagination
			query = query.limit(ITEMS_PER_PAGE).offset((page - 1) * ITEMS_PER_PAGE);

			const movieItems = (await query.execute()) as MovitemsRow[];

			return {
				maxPage,
				movieItems,
				page,
				total,
			};
		});
	});

export const getMovieItem = createServerFn({ method: "GET" })
	.inputValidator((d: { itemId: number }) => d)
	.handler(async (ctx) => {
		const { itemId } = ctx.data;

		return Sentry.startSpan({ name: "getMovieItem" }, async () => {
			const item = await db
				.selectFrom("movitems")
				.selectAll()
				.where("ITEMID", "=", itemId)
				.executeTakeFirst();

			if (!item) {
				throw new Error("Movie item not found");
			}

			return item as MovitemsRow;
		});
	});

type AddMovieItemData = {
	itemname: string;
	itemcase: ItemCase;
	itemdigitl: ItemDigitl;
	item3D: YesNo;
	itemwatch: YesNo;
	itemformat: ItemFormat;
	itemstatus: ItemStatus;
	itemurl: string;
	itemnotes?: string | null;
	itemavail?: string | null;
};

export const addMovieItem = createServerFn({ method: "POST" })
	.inputValidator((d: AddMovieItemData) => d)
	.handler(async (ctx) => {
		const data = ctx.data;

		return Sentry.startSpan({ name: "addMovieItem" }, async () => {
			await requireAdmin();

			const result = await db
				.insertInto("movitems")
				.values({
					ITEMNAME: data.itemname,
					ITEMCASE: data.itemcase,
					ITEMDIGITL: data.itemdigitl,
					ITEM3D: data.item3D,
					ITEMWATCH: data.itemwatch,
					ITEMFORMAT: data.itemformat,
					ITEMSTATUS: data.itemstatus,
					ITEMURL: data.itemurl,
					ITEMNOTES: data.itemnotes || null,
					ITEMAVAIL: data.itemavail ? new Date(data.itemavail) : null,
				})
				.executeTakeFirst();

			return { success: true, insertId: Number(result.insertId) };
		});
	});

type EditMovieItemData = AddMovieItemData & {
	itemid: number;
};

export const editMovieItem = createServerFn({ method: "POST" })
	.inputValidator((d: EditMovieItemData) => d)
	.handler(async (ctx) => {
		const data = ctx.data;

		return Sentry.startSpan({ name: "editMovieItem" }, async () => {
			await requireAdmin();

			await db
				.updateTable("movitems")
				.set({
					ITEMNAME: data.itemname,
					ITEMCASE: data.itemcase,
					ITEMDIGITL: data.itemdigitl,
					ITEM3D: data.item3D,
					ITEMWATCH: data.itemwatch,
					ITEMFORMAT: data.itemformat,
					ITEMSTATUS: data.itemstatus,
					ITEMURL: data.itemurl,
					ITEMNOTES: data.itemnotes || null,
					ITEMAVAIL: data.itemavail ? new Date(data.itemavail) : null,
				})
				.where("ITEMID", "=", data.itemid)
				.execute();

			return { success: true };
		});
	});

export const toggleWatched = createServerFn({ method: "POST" })
	.inputValidator((d: { id: number }) => d)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		return Sentry.startSpan({ name: "toggleWatched" }, async () => {
			await requireAdmin();

			// Get current watch status
			const item = await db
				.selectFrom("movitems")
				.select("ITEMWATCH")
				.where("ITEMID", "=", id)
				.executeTakeFirst();

			if (!item) {
				throw new Error("Item not found");
			}

			let ordered: number | null = null;

			// If marking as watched (was unwatched), assign next order number
			if (item.ITEMWATCH === "N") {
				const maxResult = await db
					.selectFrom("movitems")
					.select(sql<number>`max(ORDERED)`.as("max"))
					.executeTakeFirst();

				ordered = (maxResult?.max ?? 0) + 1;
			}

			await db
				.updateTable("movitems")
				.set({
					ITEMWATCH: item.ITEMWATCH === "Y" ? "N" : "Y",
					ORDERED: ordered,
				})
				.where("ITEMID", "=", id)
				.execute();

			return { success: true };
		});
	});
