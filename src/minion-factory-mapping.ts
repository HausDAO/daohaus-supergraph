import { log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { MinionTemplate } from "../generated/templates";
import { Moloch, Minion } from "../generated/schema";
import { addTransaction } from "./transactions";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedMinion(event: SummonMinion): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  MinionTemplate.create(event.params.minion);

  let minionId = molochId
    .concat("-minion-")
    .concat(event.params.minion.toHex());
  let minion = new Minion(minionId);

  log.info("**** summoned minion: {}, moloch: {}", [minionId, molochId]);

  minion.minionAddress = event.params.minion;
  minion.molochAddress = event.params.moloch;
  minion.crossChainMinion = false;
  minion.details = event.params.details;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "1";

  minion.save();

  addTransaction(event.block, event.transaction);
}

export function handleSummonedV2Minion(event: SummonMinion): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  MinionTemplate.create(event.params.minion);

  let minionId = molochId
    .concat("-minion-")
    .concat(event.params.minion.toHex());
  let minion = new Minion(minionId);

  log.info("**** summoned minion: {}, moloch: {}", [minionId, molochId]);

  minion.minionAddress = event.params.minion;
  minion.molochAddress = event.params.moloch;
  minion.crossChainMinion = false;
  minion.details = event.params.details;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "2";

  minion.save();

  addTransaction(event.block, event.transaction);
}
