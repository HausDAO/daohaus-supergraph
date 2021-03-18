import { Bytes, log, Address } from "@graphprotocol/graph-ts";
import { Moloch, Minion } from "../generated/schema";
import {
  SetUberHaus,
  UberhausMinion,
  DelegateAppointed,
  Impeachment,
} from "../generated/templates/UberhausMinionTemplate/UberhausMinion";

function loadMoloch(minionAddress: Bytes): Bytes | null {
  let contract = UberhausMinion.bind(minionAddress as Address);
  let result = contract.try_dao();
  if (result.reverted) {
    log.info("^^^^^ loadMoloch contract call reverted. minionAddress: {}", [
      minionAddress.toHexString(),
    ]);
    return null;
  }

  return result.value;
}

export function handleSetUberHaus(event: SetUberHaus): void {
  let molochAddress = loadMoloch(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = new Minion(minionId);

  let uberHausId = event.params.uberHaus.toHexString();
  let uberHausMoloch = Moloch.load(uberHausId);

  if (uberHausMoloch !== null) {
    minion.uberHausAddress = event.params.uberHaus;
    minion.uberHaus = uberHausMoloch.id;
    minion.save();
  }
}

// event DelegateAppointed(uint256 proposalId, address executor, address currentDelegate);
export function handleDelegateAppointed(event: DelegateAppointed): void {
  let molochAddress = loadMoloch(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = new Minion(minionId);

  minion.uberHausDelegate = event.params.currentDelegate;

  minion.save();
}

// event Impeachment(address delegate, address impeacher);
export function handleImpeachment(event: Impeachment): void {
  let molochAddress = loadMoloch(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = new Minion(minionId);

  minion.uberHausDelegate = event.address;

  minion.save();
}
