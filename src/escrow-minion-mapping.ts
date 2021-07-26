import { log } from "@graphprotocol/graph-ts";
import { ProposeAction } from "../generated/EscrowMinion/EscrowMinion";
// import { Moloch, Minion } from "../generated/schema";

// # event ProposeAction(uint256 proposalId, address proposer, address moloch, address[] tokenIds, uint256[3][] typesTokenIdsAmounts, address destinationVault);
export function handleProposeAction(event: ProposeAction): void {
  // build proposal id
  // load proposal - log on a test to ensure we have the proposal at this stage
  // create/save ProposalEscrow entity
  // anything on the proposal - isExecuted?
}

// # event ExecuteAction(uint256 proposalId, address executor, address moloch);
// # event ActionCanceled(uint256 proposalId, address moloch);
