import { BigInt, log, Address } from "@graphprotocol/graph-ts";
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
import { Member, Proposal, Vote, Moloch, Badge } from "../generated/schema";
import { createOrUpdateVotedBadge } from "./badges";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);

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

  let contract = Moloch.bind(event.address);
  moloch.currentPeriod = contract.getCurrentPeriod();
  moloch.periodDuration = contract.periodDuration();
  moloch.votingPeriodLength = contract.votingPeriodLength();
  moloch.gracePeriodLength = contract.gracePeriodLength();
  moloch.proposalDeposit = contract.proposalDeposit();
  moloch.dilutionBound = contract.dilutionBound();
  moloch.processingReward = contract.processingReward();
  moloch.summoningTime = contract.summoningTime();
  moloch.save();
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
  proposal.yesShares = BigInt.fromI32(0);
  proposal.noShares = BigInt.fromI32(0);
  proposal.processed = false;
  proposal.didPass = false;
  proposal.aborted = false;
  proposal.details = details;

  // TODO: these values are for V2, but can't be null in v1 due to math issues
  // Might be able to get some of these in other ways - but many don't apply
  proposal.sponsor = Address.fromString(ZERO_ADDRESS);
  proposal.lootRequested = BigInt.fromI32(0);
  proposal.tributeToken = Address.fromString(ZERO_ADDRESS);
  proposal.paymentRequested = BigInt.fromI32(0);
  proposal.paymentToken = Address.fromString(ZERO_ADDRESS);

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

  createOrUpdateVotedBadge(event.params.memberAddress);

  // let badge = Badge.load(event.params.memberAddress.toHex());
  // if (badge == null) {
  //   badge = new Badge(event.params.memberAddress.toHex());
  //   badge.memberAddress = event.params.memberAddress;
  //   badge.createdAt = event.block.timestamp.toString();
  //   badge.voteCount = BigInt.fromI32(1);
  // } else {
  //   badge.voteCount = badge.voteCount.plus(BigInt.fromI32(1));
  // }
  // badge.save();

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  let member = Member.load(memberId);
  if (event.params.uintVote == 1) {
    proposal.yesVotes = proposal.yesVotes.plus(BigInt.fromI32(1));
    proposal.yesShares = proposal.yesShares.plus(member.shares);
  }
  if (event.params.uintVote == 2) {
    proposal.noVotes = proposal.noVotes.plus(BigInt.fromI32(1));
    proposal.noShares = proposal.noShares.plus(member.shares);
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
