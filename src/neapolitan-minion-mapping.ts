import { Address, Bytes, log, store } from "@graphprotocol/graph-ts";
import {
  Minion,
  MinionStream,
  MinionAction,
  Proposal,
} from "../generated/schema";
import {
  ProposeAction,
  NeapolitanMinion,
} from "../generated/templates/NeapolitanMinionTemplate/NeapolitanMinion";

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
  minionAction.value = event.params.value;
  minionAction.data = event.params.data;
  minionAction.index = event.params.index;

  minionAction.save();
}

// TODO: changeowner
// - moves minion to another dao
// - new field for 'retired' in old dao so we can hide in ui
// - create a new minion entity for the new dao
// SetModel - need info

// # event ExecuteAction(bytes32 indexed id, uint256 indexed proposalId, uint256 index, address targets, uint256 values, bytes datas, address executor);
// # event ActionCanceled(uint256 proposalId);
// # event ProposeSignature(uint256 proposalId, bytes32 msgHash, address proposer);
// # event SignatureCanceled(uint256 proposalId, bytes32 msgHash);
// # event ExecuteSignature(uint256 proposalId, address executor);
