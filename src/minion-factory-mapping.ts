import { log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { Moloch, Minion } from "../generated/schema";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedMinion(event: SummonMinion): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  let minionId = molochId
    .concat("-minion-")
    .concat(event.params.minion.toHex());
  let minion = new Minion(minionId);

  log.info("**** summoned minion: {}, moloch: {}", [minionId, molochId]);

  minion.minionAddress = event.params.minion;
  minion.molochAddress = event.params.moloch;
  minion.details = event.params.details;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();

  minion.save();
}
