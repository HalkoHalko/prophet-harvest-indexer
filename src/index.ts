import { ponder } from "@/generated";
import * as schema from "../ponder.schema";
import Web3 from "web3";

// Load environment variables
const rpcUrl = process.env.PONDER_RPC_URL_1;

// Initialize Web3
if (!rpcUrl) {
  throw new Error("PONDER_RPC_URL_1 environment variable is not defined");
}
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

// Event signature for Swap: Swap(address,uint256,uint256,uint256,uint256,address)
const swapEventSignature = web3.utils.keccak256('Swap(address,uint256,uint256,uint256,uint256,address)');

ponder.on("ProphetHarvest:Harvest", async ({ event, context }) => {
  // Fetch the transaction receipt to get the logs
  const receipt = await web3.eth.getTransactionReceipt(event.log.transactionHash);

  // Initialize swap details
  let swapOccurred = false;
  let amount0In = null;
  let amount1In = null;
  let amount0Out = null;
  let amount1Out = null;

  // Check if a Swap event occurred in the logs
  for (const log of receipt.logs) {
    if (log.topics && log.topics[0] === swapEventSignature) {
      swapOccurred = true;
      if (log.data) {
        const decodedData = web3.eth.abi.decodeParameters(
          ['uint256', 'uint256', 'uint256', 'uint256'],
          log.data
        );
        amount0In = BigInt(decodedData[0] as string);
        amount1In = BigInt(decodedData[1] as string);
        amount0Out = BigInt(decodedData[2] as string);
        amount1Out = BigInt(decodedData[3] as string);
      }
      break;
    }
  }

  await context.db
    .insert(schema.harvestEvent)
    .values({
      id: event.log.id,
      user: event.args.user,
      amount: event.args.amount,
      swapOccurred: swapOccurred,
      transactionId: event.log.transactionHash,
      amount0In: amount0In,
      amount1In: amount1In,
      amount0Out: amount0Out,
      amount1Out: amount1Out,
    });
});