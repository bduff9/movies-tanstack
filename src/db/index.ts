import { Kysely, MysqlDialect } from "kysely";
import { createPool } from "mysql2";
import type { DB } from "./types";

const dialect = new MysqlDialect({
	pool: createPool({
		uri: process.env.DATABASE_URL,
	}),
});

export const db = new Kysely<DB>({
	dialect,
});

// Re-export types for convenience
export type {
	DB,
	ItemCase,
	ItemDigitl,
	ItemFormat,
	ItemStatus,
	Movies,
	Movitems,
	YesNo,
} from "./types";
