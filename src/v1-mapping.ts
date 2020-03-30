import {
  V1Moloch as Contract,
  SummonComplete,
  SubmitProposal,
  SubmitVote,
  ProcessProposal,
  UpdateDelegateKey,
  Ragequit,
  Abort
} from "../generated/templates/MolochV1Template/V1Moloch";
import { BigInt, log } from "@graphprotocol/graph-ts";
import { Member, Proposal, Vote, Moloch } from "../generated/schema";

export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.summoner.toHex());

  let member = new Member(memberId);
  member.molochAddress = event.address;
  member.moloch = moloch.id;
  member.memberAddress = event.params.summoner;
  member.createdAt = event.block.timestamp.toString();
  member.delegateKey = event.params.summoner;
  member.shares = event.params.shares;
  member.exists = true;
  member.tokenTribute = BigInt.fromI32(0);
  member.didRagequit = false;
  member.save();
}

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let contract = Contract.bind(event.address);
  let proposalFromContract = contract.proposalQueue(event.params.proposalIndex);
  let startingPeriod = proposalFromContract.value3;
  let details = proposalFromContract.value10;

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());
  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let proposal = new Proposal(proposalId);
  proposal.molochAddress = event.address;
  proposal.moloch = moloch.id;
  proposal.createdAt = event.block.timestamp.toString();
  proposal.proposalIndex = event.params.proposalIndex;
  proposal.proposalId = event.params.proposalIndex;
  proposal.startingPeriod = startingPeriod;
  proposal.delegateKey = event.params.delegateKey;
  proposal.member = memberId;
  proposal.memberAddress = event.params.memberAddress;
  proposal.applicant = event.params.applicant;
  proposal.tributeOffered = event.params.tokenTribute;
  proposal.sharesRequested = event.params.sharesRequested;
  proposal.yesVotes = BigInt.fromI32(0);
  proposal.noVotes = BigInt.fromI32(0);
  proposal.processed = false;
  proposal.didPass = false;
  proposal.aborted = false;
  proposal.details = details;
  proposal.save();
}

export function handleSubmitVote(event: SubmitVote): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let proposalVotedId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let voteID = memberId
    .concat("-vote-")
    .concat(event.params.proposalIndex.toString());

  let vote = new Vote(voteID);
  vote.molochAddress = event.address;
  vote.createdAt = event.block.timestamp.toString();
  vote.proposalIndex = event.params.proposalIndex;
  vote.delegateKey = event.params.delegateKey;
  vote.memberAddress = event.params.memberAddress;
  vote.uintVote = event.params.uintVote;
  vote.proposal = proposalVotedId;
  vote.member = memberId;
  vote.save();

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  if (event.params.uintVote == 1) {
    proposal.yesVotes = proposal.yesVotes.plus(BigInt.fromI32(1));
  }
  if (event.params.uintVote == 2) {
    proposal.noVotes = proposal.noVotes.plus(BigInt.fromI32(1));
  }

  proposal.save();
}

export function handleProcessProposal(event: ProcessProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  proposal.applicant = event.params.applicant;
  proposal.memberAddress = event.params.memberAddress;
  proposal.tributeOffered = event.params.tokenTribute;
  proposal.sharesRequested = event.params.sharesRequested;
  proposal.didPass = event.params.didPass;
  proposal.processed = true;
  proposal.save();

  if (event.params.didPass) {
    let memberId = molochId
      .concat("-member-")
      .concat(event.params.applicant.toHex());

    let member = Member.load(memberId);

    if (member == null) {
      let newMember = new Member(memberId);
      newMember.molochAddress = event.address;
      newMember.moloch = moloch.id;
      newMember.memberAddress = event.params.applicant;
      newMember.createdAt = event.block.timestamp.toString();
      newMember.delegateKey = event.params.applicant;
      newMember.shares = event.params.sharesRequested;
      newMember.exists = true;
      newMember.tokenTribute = event.params.tokenTribute;
      newMember.didRagequit = false;
      newMember.save();
    } else {
      member.shares = member.shares.plus(event.params.sharesRequested);
      member.tokenTribute = member.tokenTribute.plus(event.params.tokenTribute);
      member.save();
    }
  }
}

export function handleRagequit(event: Ragequit): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let member = Member.load(memberId);
  member.shares = member.shares.minus(event.params.sharesToBurn);
  if (member.shares.equals(new BigInt(0))) {
    member.exists = false;
  }
  member.save();
}

export function handleAbort(event: Abort): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  proposal.aborted = true;
  proposal.save();
}

export function handleUpdateDelegateKey(event: UpdateDelegateKey): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let member = Member.load(memberId);
  member.delegateKey = event.params.newDelegateKey;
  member.save();
}
