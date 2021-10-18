import { Address, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  Minion,
  MinionStream,
  MinionAction,
  Proposal,
} from "../generated/schema";
import {
  ProposeAction,
  ExecuteAction,
  NeapolitanMinion,
} from "../generated/templates/NeapolitanMinionTemplate/NeapolitanMinion";
import { addTransaction } from "./transactions";

function getMolochAddressFromChildMinion(minionAddress: Bytes): Bytes | null {
  let contract = NeapolitanMinion.bind(minionAddress as Address);
  let result = contract.try_moloch();
  if (result.reverted) {
    log.info("^^^^^ loadMoloch contract call reverted. minionAddress: {}", [
      minionAddress.toHexString(),
    ]);
    return null;
  }

  return result.value;
}

// # event ProposeAction(bytes32 indexed id, uint256 indexed proposalId, uint256 index, address targets, uint256 values, bytes datas);
export function handleProposeAction(event: ProposeAction): void {
  let molochAddress = getMolochAddressFromChildMinion(event.address);
  if (molochAddress == null) {
    return;
  }

  let proposalId = molochAddress
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(proposalId);

  log.info("^^^^^ NeapolitanMinion loaded proposal: {}", [proposal.id]);

  let minionActionId = event.address
    .toHexString()
    .concat("-minionAction-")
    .concat(event.params.proposalId.toString())
    .concat("-")
    .concat(event.params.index.toString());

  let minionAction = new MinionAction(minionActionId);
  minionAction.proposal = proposal.id;
  minionAction.minionAddress = event.address;
  minionAction.molochAddress = molochAddress as Bytes;
  minionAction.target = event.params.target;
  minionAction.withdrawToken = Address.fromString("0x0000000000000000000000000000000000000000");
  minionAction.withdrawValue = event.params.value;
  minionAction.data = event.params.data;
  minionAction.memberOnly = false;
  minionAction.index = event.params.index;

  minionAction.save();
}

// # event ExecuteAction(bytes32 indexed id, uint256 indexed proposalId, uint256 index, address targets, uint256 values, bytes datas, address executor);
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
