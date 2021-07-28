import { ethereum } from "@graphprotocol/graph-ts";
import { MolochTransaction } from "../generated/schema";

export function addTransaction(
  block: ethereum.Block,
  tx: ethereum.Transaction
): void {
  let transaction = new MolochTransaction(tx.hash.toHex());
  transaction.createdAt = block.timestamp.toString();
  transaction.save();
}
