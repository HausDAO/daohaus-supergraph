import { log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { SummonUberMinion } from "../generated/UberMinionFactory/UberMinionFactory";
import { UberhausMinionTemplate } from "../generated/templates";
import { SummonMinion as SummonSuperfluidMinion } from "../generated/SuperfluidMinionFactory/SuperfluidMinionFactory";
import { SuperfluidMinionTemplate } from "../generated/templates";
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

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedSuperfluidMinion(event: SummonSuperfluidMinion): void {
  SuperfluidMinionTemplate.create(event.params.minion);
  handleSummonedMinion(event as SummonMinion);
}