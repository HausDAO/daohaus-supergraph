import { log } from "@graphprotocol/graph-ts";
import { SummonUberMinion } from "../generated/UberMinionFactory/UberMinionFactory";
import { UberhausMinionTemplate } from "../generated/templates";
import { Moloch, Minion } from "../generated/schema";

// event SummonUberMinion(address indexed uberminion,
// address indexed dao,
// address uberHaus,
// address controller,
// address initialDelegate,
// uint256 delegateRewardFactor,
// uint256 minionId
// string desc,
// string name);
export function handleSummonedUberMinion(event: SummonUberMinion): void {
  log.info("**** summoned uberminion EVENT", []);
  UberhausMinionTemplate.create(event.params.uberminion);

  let molochId = event.params.dao.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    log.info("**** summoned uberminion missing moloch", []);
    return;
  }

  let minionUUId = molochId
    .concat("-minion-")
    .concat(event.params.uberminion.toHex());
  let minion = new Minion(minionUUId);
  log.info("**** summoned uberminion: {}, moloch: {}", [minionUUId, molochId]);

  minion.minionAddress = event.params.uberminion;
  minion.molochAddress = event.params.dao;
  minion.details = event.params.desc;
  minion.minionType = event.params.name;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.uberHausDelegateRewardFactor = event.params.delegateRewardFactor;
  minion.uberHausDelegate = event.params.initialDelegate;

  let uberHausId = event.params.uberHaus.toHexString();
  let uberHausMoloch = Moloch.load(uberHausId);
  if (uberHausMoloch !== null) {
    minion.uberHausAddress = event.params.uberHaus;
    minion.uberHaus = uberHausMoloch.id;
  }

  minion.save();
}
