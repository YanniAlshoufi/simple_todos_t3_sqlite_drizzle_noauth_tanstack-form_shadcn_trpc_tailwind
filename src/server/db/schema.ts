import { sql } from "drizzle-orm";
import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `todos_${name}`);

export const todos = createTable("todos", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  text: d.text().notNull(),
  checked: d.integer({ mode: "boolean" }).notNull(),
  sorting: d.integer({ mode: "number" }).notNull(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
}));
