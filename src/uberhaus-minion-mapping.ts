import { Bytes, log, Address } from "@graphprotocol/graph-ts";
import { Moloch, Minion, Proposal } from "../generated/schema";
import {
  SetUberHaus,
  UberhausMinion,
  DelegateAppointed,
  Impeachment,
  ExecuteAction,
} from "../generated/templates/UberhausMinionTemplate/UberhausMinion";
import { addTransaction } from "./transactions";

function getMolochAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
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
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = Minion.load(minionId);

  let uberHausId = event.params.uberHaus.toHexString();
  let uberHausMoloch = Moloch.load(uberHausId);

  if (uberHausMoloch !== null) {
    minion.uberHausAddress = event.params.uberHaus;
    minion.uberHaus = uberHausMoloch.id;
    minion.save();
  }

  addTransaction(event.block, event.transaction);
}

// event DelegateAppointed(uint256 proposalId, address executor, address currentDelegate);
export function handleDelegateAppointed(event: DelegateAppointed): void {
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = Minion.load(minionId);

  minion.uberHausDelegate = event.params.currentDelegate;

  minion.save();

  addTransaction(event.block, event.transaction);
}

// event Impeachment(address delegate, address impeacher);
export function handleImpeachment(event: Impeachment): void {
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress == null) {
    return;
  }
  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = Minion.load(minionId);

  minion.uberHausDelegate = event.address;

  minion.save();

  addTransaction(event.block, event.transaction);
}

// event ExecuteAction(uint256 proposalId, address executor);
export function handleExecuteAction(event: ExecuteAction): void {
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress == null) {
    return;
  }

  let processProposalId = molochAddress
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(processProposalId);

  proposal.uberHausMinionExecuted = true;

  proposal.save();

  addTransaction(event.block, event.transaction);
}
