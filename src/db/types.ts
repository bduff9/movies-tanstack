import type { Generated } from "kysely";

// Enum types
export type ItemCase = "Box" | "Digibook" | "Plain" | "Slipcover" | "Steelbook";

export type ItemDigitl = "DC" | "DC+UV" | "None" | "UV";

export type ItemFormat = "Blu-ray" | "Digital" | "DVD" | "Ultra HD" | "UV";

export type ItemStatus = "Owned" | "Selling" | "Waiting" | "Wanted";

export type YesNo = "N" | "Y";

// Database tables with Generated for auto-increment columns
export interface Movitems {
	ITEM3D: YesNo;
	ITEMAVAIL: Date | null;
	ITEMCASE: ItemCase;
	ITEMDIGITL: ItemDigitl;
	ITEMFORMAT: ItemFormat;
	ITEMID: Generated<number>;
	ITEMNAME: string;
	ITEMNOTES: string | null;
	ITEMSTATUS: ItemStatus;
	ITEMURL: string;
	ITEMWATCH: YesNo;
	ORDERED: number | null;
}

export interface Movies {
	ITEMID: number | null;
	MOVIEID: Generated<number>;
	MOVIETITLE: string | null;
	MOVIEURL: string | null;
}

export interface DB {
	movitems: Movitems;
	movies: Movies;
}

// Type helpers for select results (unwraps Generated types)
export type MovitemsRow = {
	ITEM3D: YesNo;
	ITEMAVAIL: Date | null;
	ITEMCASE: ItemCase;
	ITEMDIGITL: ItemDigitl;
	ITEMFORMAT: ItemFormat;
	ITEMID: number;
	ITEMNAME: string;
	ITEMNOTES: string | null;
	ITEMSTATUS: ItemStatus;
	ITEMURL: string;
	ITEMWATCH: YesNo;
	ORDERED: number | null;
};

export type MoviesRow = {
	ITEMID: number | null;
	MOVIEID: number;
	MOVIETITLE: string | null;
	MOVIEURL: string | null;
};
