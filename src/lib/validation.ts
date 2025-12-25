import { type } from "arktype";
import { isTuesday } from "./date";

// Enum types
export const itemCaseType = type(
	"'Plain' | 'Box' | 'Slipcover' | 'Digibook' | 'Steelbook'",
);
export const itemDigitlType = type("'None' | 'DC' | 'UV' | 'DC+UV'");
export const yesNoType = type("'Y' | 'N'");
export const itemFormatType = type(
	"'Blu-ray' | 'DVD' | 'Ultra HD' | 'UV' | 'Digital'",
);
export const itemStatusType = type(
	"'Owned' | 'Wanted' | 'Selling' | 'Waiting'",
);

// Movie item validation schema
export const movieItemSchema = type({
	itemid: "number >= 0",
	itemname: "string >= 1",
	itemcase: itemCaseType,
	itemdigitl: itemDigitlType,
	item3D: yesNoType,
	itemwatch: yesNoType,
	itemformat: itemFormatType,
	itemstatus: itemStatusType,
	itemurl: "string.url",
	"itemnotes?": "string | null",
	"itemavail?": "Date | null",
});

// Movie validation schema
export const movieSchema = type({
	itemid: "number",
	movietitle: "string >= 1",
	movieurl: "string.url",
});

// Search params validation
export const searchParamsSchema = type({
	"page?": "string",
	"sort?": "'ordered' | 'itemid' | 'itemname'",
	"order?": "'asc' | 'desc'",
	"itemname?": "string",
	"itemcase?": itemCaseType.or(type("''")),
	"itemdigitl?": itemDigitlType.or(type("''")),
	"item3D?": yesNoType.or(type("''")),
	"itemformat?": itemFormatType.or(type("''")),
	"itemstatus?": itemStatusType.or(type("''")),
});

// Helper to validate and handle errors
export function validate<T>(
	schema: (data: unknown) => T | type.errors,
	data: unknown,
): { success: true; data: T } | { success: false; errors: type.errors } {
	const result = schema(data);
	if (result instanceof type.errors) {
		return { success: false, errors: result };
	}
	return { success: true, data: result as T };
}

// Custom validation for release date (must be Tuesday)
export function validateReleaseDate(date: Date | null | undefined): boolean {
	if (!date) return true; // Optional field
	return isTuesday(date);
}

// Type exports for use in components
export type ItemCase = typeof itemCaseType.infer;
export type ItemDigitl = typeof itemDigitlType.infer;
export type YesNo = typeof yesNoType.infer;
export type ItemFormat = typeof itemFormatType.infer;
export type ItemStatus = typeof itemStatusType.infer;
export type MovieItem = typeof movieItemSchema.infer;
export type Movie = typeof movieSchema.infer;
export type SearchParams = typeof searchParamsSchema.infer;
