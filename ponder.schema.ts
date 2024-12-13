import { onchainTable } from "@ponder/core";

export const harvestEvent = onchainTable("harvest_event", (t) => ({
  id: t.text().primaryKey(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  swapOccurred: t.boolean().notNull().default(false),
  transactionId: t.text().notNull(),
  amount0In: t.bigint(),
  amount1In: t.bigint(),
  amount0Out: t.bigint(),
  amount1Out: t.bigint(),
}));