import { ponder } from "@/generated";
import * as schema from "../ponder.schema";

ponder.on("ProphetHarvest:Harvest", async ({ event, context }) => {
  await context.db
    .insert(schema.harvestEvent)
    .values({ id: event.log.id, user: event.args.user, amount: event.args.amount });
});
