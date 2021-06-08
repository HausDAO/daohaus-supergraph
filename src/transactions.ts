import { EthereumTransaction, EthereumBlock } from "@graphprotocol/graph-ts";
import { MolochTransaction } from "../generated/schema";

export function addTransaction(
  block: EthereumBlock,
  tx: EthereumTransaction
): void {
  let transaction = new MolochTransaction(tx.hash.toHex());
  transaction.createdAt = block.timestamp.toString();
  transaction.save();
}
