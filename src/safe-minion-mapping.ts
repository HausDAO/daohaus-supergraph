import { Address, BigInt, Bytes, ethereum, log, store } from "@graphprotocol/graph-ts";
import {
  Minion,
  MinionStream,
  MinionAction,
  Proposal,
} from "../generated/schema";
import {
  ProposeNewAction,
  ExecuteAction,
  SafeMinion,
} from "../generated/templates/SafeMinionTemplate/SafeMinion";
import { addTransaction } from "./transactions";

function getAddressFromChildMinion(minionAddress: Bytes, result: ethereum.CallResult<Address>): Bytes | null {
  if (result.reverted) {
    log.info("^^^^^ loadMoloch contract call reverted. minionAddress: {}", [
      minionAddress.toHexString(),
    ]);
    return null;
  }

  return result.value;
}

function getMolochAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
  let contract = SafeMinion.bind(minionAddress as Address);
  return getAddressFromChildMinion(minionAddress, contract.try_moloch());
}

function getAvatarAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
  let contract = SafeMinion.bind(minionAddress as Address);
  return getAddressFromChildMinion(minionAddress, contract.try_avatar());
}

// # event ProposeNewAction(bytes32 indexed id, uint256 indexed proposalId, address withdrawToken, uint256 withdrawAmount, address moloch, bool memberOnly, bytes transactions);
export function handleProposeAction(event: ProposeNewAction): void {
  let molochAddress = event.params.moloch;
  if (molochAddress == null) {
    return;
  }

  let avatarAddress = getAvatarAddressFromChildMinion(event.address);
  let proposalId = molochAddress
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(proposalId);

  log.info("^^^^^ SafeMinion loaded proposal: {}", [proposal.id]);

  let index = BigInt.fromI32(0);

  let minionActionId = event.address
    .toHexString()
    .concat("-minionAction-")
    .concat(event.params.proposalId.toString())
    .concat("-")
    .concat(index.toString());

  let minionAction = new MinionAction(minionActionId);
  minionAction.proposal = proposal.id;
  minionAction.minionAddress = event.address;
  minionAction.molochAddress = molochAddress as Bytes;
  minionAction.target = avatarAddress as Bytes;
  minionAction.withdrawToken = event.params.withdrawToken;
  minionAction.withdrawValue = event.params.withdrawAmount;
  minionAction.data = event.params.transactions;
  minionAction.index = index;

  minionAction.save();
}

// # event ExecuteAction(bytes32 indexed id, uint256 indexed proposalId, bytes transactions, address avatar);
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

  proposal.executed = true;

  proposal.save();

  addTransaction(event.block, event.transaction);
}

// TODO: changeowner
// - moves minion to another dao
// - new field for 'retired' in old dao so we can hide in ui
// - create a new minion entity for the new dao
// SetModel - need info
