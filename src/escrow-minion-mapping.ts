import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  ProposeAction,
  ExecuteAction,
} from "../generated/EscrowMinion/EscrowMinion";
import { Proposal, ProposalEscrow } from "../generated/schema";
import { addTransaction } from "./transactions";

// event ProposeAction(uint256 proposalId, address proposer, address moloch, address[] tokens, uint256[MAX_LENGTH] types, uint256[MAX_LENGTH] tokenIds, uint256[MAX_LENGTH] amounts, address destinationVault);
export function handleProposeAction(event: ProposeAction): void {
  let actionProposalId = event.params.moloch
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());

  let proposal = Proposal.load(actionProposalId);

  log.info("^^^^^ escrow found proposal {}", [proposal.id]);

  let escrowId = event.params.moloch
    .toHexString()
    .concat("-proposalEscrow-")
    .concat(event.params.proposalId.toString());

  let escrow = new ProposalEscrow(escrowId);

  escrow.proposal = proposal.id;
  escrow.minionAddress = event.params.destinationVault;
  escrow.molochAddress = event.params.moloch;
  escrow.proposer = event.params.proposer;
  escrow.tokenAddresses = event.params.tokens as Bytes[];
  escrow.tokenTypes = event.params.types;
  escrow.tokenIds = event.params.tokenIds;
  escrow.amounts = event.params.amounts;

  escrow.save();

  proposal.isMinion = true;
  proposal.minionAddress = event.address;

  proposal.save();
}

// # event ExecuteAction(uint256 proposalId, address executor, address moloch);
export function handleExecuteAction(event: ExecuteAction): void {
  let processProposalId = event.params.moloch
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(processProposalId);

  proposal.executed = true;

  proposal.save();

  addTransaction(event.block, event.transaction);
}
