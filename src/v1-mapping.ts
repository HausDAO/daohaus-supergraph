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
import { MolochV1Template } from "../generated/templates";
import { Member, Proposal, Vote, Moloch } from "../generated/schema";
import {
  addVotedBadge,
  addSummonBadge,
  addRageQuitBadge,
  addProposalSubmissionBadge
} from "./badges";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHex();
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

  // let contract = Contract.bind(event.address);
  // moloch.periodDuration = contract.periodDuration();
  // moloch.votingPeriodLength = contract.votingPeriodLength();
  // moloch.gracePeriodLength = contract.gracePeriodLength();
  // moloch.proposalDeposit = contract.proposalDeposit();
  // moloch.dilutionBound = contract.dilutionBound();
  // moloch.processingReward = contract.processingReward();
  // moloch.summoningTime = contract.summoningTime();

  moloch.summoningTime = event.block.timestamp;
  moloch.save();

  addSummonBadge(event.params.summoner);
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

  // TODO: these values are for V2, but can't be null in v1 due to math issues - not used in v1
  proposal.sponsor = Address.fromString(ZERO_ADDRESS);
  proposal.lootRequested = BigInt.fromI32(0);
  proposal.tributeToken = Address.fromString(ZERO_ADDRESS);
  proposal.paymentRequested = BigInt.fromI32(0);
  proposal.paymentToken = Address.fromString(ZERO_ADDRESS);

  proposal.save();

  addProposalSubmissionBadge(event.params.memberAddress);
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

  addVotedBadge(event.params.memberAddress);

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

    moloch.totalShares = moloch.totalShares.plus(proposal.sharesRequested);
    moloch.save();
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

  addRageQuitBadge(event.params.memberAddress);

  moloch.totalShares = moloch.totalShares.minus(event.params.sharesToBurn);
  moloch.save();
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

export function handleSummonCompleteLegacy(event: SummonComplete): void {
  MolochV1Template.create(event.address);

  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);

  // let titles = {
  //   "0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1": "Moloch DAO",
  //   "0x0372f3696fa7dc99801f435fd6737e57818239f2": "MetaCartel DAO"
  // };
  let title =
    event.address.toHex() === "0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1"
      ? "Moloch DAO"
      : "MetaCartel DAO";
  moloch.title = title;

  moloch.newContract = "1";
  moloch.version = "1";
  moloch.deleted = false;
  moloch.summoner = event.params.summoner;

  moloch.totalShares = BigInt.fromI32(1);
  moloch.totalLoot = BigInt.fromI32(0);
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.proposalQueueCount = BigInt.fromI32(0);
  moloch.proposalDeposit = BigInt.fromI32(0);
  moloch.dilutionBound = BigInt.fromI32(0);
  moloch.processingReward = BigInt.fromI32(0);

  let approvedTokens: string[] = [];
  moloch.approvedTokens = approvedTokens;

  moloch.save();

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

  // let contract = Contract.bind(event.address);
  // moloch.periodDuration = contract.periodDuration();
  // moloch.votingPeriodLength = contract.votingPeriodLength();
  // moloch.gracePeriodLength = contract.gracePeriodLength();
  // moloch.proposalDeposit = contract.proposalDeposit();
  // moloch.dilutionBound = contract.dilutionBound();
  // moloch.processingReward = contract.processingReward();
  // moloch.summoningTime = contract.summoningTime();

  moloch.summoningTime = event.block.timestamp;
  moloch.save();

  addSummonBadge(event.params.summoner);
}
