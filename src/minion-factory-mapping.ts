import { log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { Moloch, Minion } from "../generated/schema";

// Summoned (index_topic_1 address minion, index_topic_2 address dao, string details)
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
  minion.name = event.params.name;
  minion.moloch = moloch.id;

  minion.save();
}
