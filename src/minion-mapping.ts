import { Address, Bytes, ethereum, log, store } from "@graphprotocol/graph-ts";
import { Proposal } from "../generated/schema";
import {
  Minion,
  ExecuteAction,
} from "../generated/templates/MinionTemplate/Minion";
import { addTransaction } from "./transactions";

function getAddressFromChildMinion(
  minionAddress: Bytes,
  result: ethereum.CallResult<Address>
): Bytes | null {
  if (result.reverted) {
    log.info("^^^^^ loadMoloch contract call reverted. minionAddress: {}", [
      minionAddress.toHexString(),
    ]);
    return null;
  }

  return result.value;
}

function getMolochAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
  // let contract = SafeMinion.bind(minionAddress as Address);
  let address = changetype<Address>(minionAddress);
  let contract = Minion.bind(address);

  return getAddressFromChildMinion(minionAddress, contract.try_moloch());
}

// event ExecuteAction(uint256 proposalId, address executor);
export function handleExecuteAction(event: ExecuteAction): void {
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress) {
    let processProposalId = molochAddress
      .toHexString()
      .concat("-proposal-")
      .concat(event.params.proposalId.toString());
    let proposal = Proposal.load(processProposalId);
    if (proposal) {
      proposal.executed = true;
      proposal.save();
      addTransaction(event.block, event.transaction);
    }
  }
}

// TODO: changeowner
// - moves minion to another dao
// - new field for 'retired' in old dao so we can hide in ui
// - create a new minion entity for the new dao
// SetModel - need info
