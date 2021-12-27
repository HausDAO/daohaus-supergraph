import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  ethereum,
  log,
  store,
} from "@graphprotocol/graph-ts";
import {
  Minion,
  MinionStream,
  MinionAction,
  Proposal,
  Moloch,
} from "../generated/schema";
import {
  ProposeNewAction,
  ExecuteAction,
  SafeMinion,
} from "../generated/templates/SafeMinionTemplate/SafeMinion";
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
  let contract = SafeMinion.bind(address);

  return getAddressFromChildMinion(minionAddress, contract.try_moloch());
}

function getAvatarAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
  // let contract = SafeMinion.bind(minionAddress as Address);
  let address = changetype<Address>(minionAddress);
  let contract = SafeMinion.bind(address);
  return getAddressFromChildMinion(minionAddress, contract.try_avatar());
}

// # event ProposeNewAction(bytes32 indexed id, uint256 indexed proposalId, address withdrawToken, uint256 withdrawAmount, address moloch, bool memberOnly, bytes transactions);
export function handleProposeAction(event: ProposeNewAction): void {
  let molochAddress = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochAddress);
  if (moloch == null) {
    return;
  }

  let avatarAddress = getAvatarAddressFromChildMinion(event.address);
  let proposalId = molochAddress
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(proposalId);

  if (proposal == null) {
    return;
  }

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
  minionAction.molochAddress = event.params.moloch as Bytes;
  minionAction.target = avatarAddress as Bytes;
  minionAction.withdrawToken = event.params.withdrawToken;
  minionAction.withdrawValue = event.params.withdrawAmount;
  minionAction.data = event.params.transactions;
  minionAction.memberOnly = event.params.memberOnly;
  minionAction.index = index;

  minionAction.save();
}

// # event ExecuteAction(bytes32 indexed id, uint256 indexed proposalId, bytes transactions, address avatar);
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
