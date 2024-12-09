import { onchainTable } from "@ponder/core";

export const harvestEvent = onchainTable("harvest_event", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
}));