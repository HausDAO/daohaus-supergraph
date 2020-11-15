import { log } from "@graphprotocol/graph-ts";
import { Summoned } from "../generated/MinionFactory/MinionFactory";
import { Moloch, Minion } from "../generated/schema";

// Summoned (index_topic_1 address minion, index_topic_2 address dao, address summoner, string details)
export function handleSummonedMinion(event: Summoned): void {
  let molochId = event.params.dao.toHexString();
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
  minion.molochAddress = event.params.dao;
  minion.details = event.params.details;
  minion.moloch = moloch.id;

  minion.save();
}
