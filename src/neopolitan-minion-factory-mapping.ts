import { log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/NeopolitanMinionFactory/NeopolitanMinionFactory";
import { NeopolitanMinionTemplate } from "../generated/templates";
import { Moloch, Minion } from "../generated/schema";
import { addTransaction } from "./transactions";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType, uint256 minQuorum);
export function handleSummonedNeopolitanMinion(event: SummonMinion): void {
  NeopolitanMinionTemplate.create(event.params.minion);

  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  let minionId = molochId
    .concat("-minion-")
    .concat(event.params.minion.toHex());
  let minion = new Minion(minionId);

  log.info("**** summoned neopolitan: {}, moloch: {}", [minionId, molochId]);

  minion.minionAddress = event.params.minion;
  minion.molochAddress = event.params.moloch;
  minion.details = event.params.details;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "3";
  minion.minQuorum = event.params.minQuorum;

  minion.save();

  addTransaction(event.block, event.transaction);
}
