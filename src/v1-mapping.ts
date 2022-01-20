import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import {
  V1Moloch as Contract,
  SummonComplete,
  SubmitProposal,
  SubmitVote,
  ProcessProposal,
  UpdateDelegateKey,
  Ragequit,
  Abort,
} from "../generated/templates/MolochV1Template/V1Moloch";
import { Guildbank } from "../generated/templates/MolochV1Template/Guildbank";
import { Erc20 } from "../generated/templates/MolochV1Template/Erc20";
import {
  Member,
  Proposal,
  Vote,
  Moloch,
  RageQuit,
  Token,
  DaoMeta,
} from "../generated/schema";
import { createAndApproveToken } from "./v2-mapping";
import { addTransaction } from "./transactions";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

function getBalance(guildBankAddress: Address): BigInt {
  let guildBank = Guildbank.bind(guildBankAddress);
  let tokenAddress = guildBank.approvedToken();
  let token = Erc20.bind(tokenAddress);

  let balance = token.balanceOf(guildBankAddress);

  return balance;
}

export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.address.toHex();
  let moloch = new Moloch(molochId);
  let daoMeta = DaoMeta.load(molochId);

  if (moloch && daoMeta) {
    if (daoMeta.newContract == "0") {
      return;
    }

    moloch.summoner = event.params.summoner;
    moloch.newContract = daoMeta.newContract;
    moloch.version = daoMeta.version;
    moloch.deleted = false;
    moloch.totalShares = BigInt.fromI32(1);
    moloch.totalLoot = BigInt.fromI32(0);
    moloch.proposalDeposit = BigInt.fromI32(0);
    moloch.dilutionBound = BigInt.fromI32(0);
    moloch.processingReward = BigInt.fromI32(0);

    let contract = Contract.bind(event.address);
    moloch.periodDuration = contract.periodDuration();
    moloch.votingPeriodLength = contract.votingPeriodLength();
    moloch.gracePeriodLength = contract.gracePeriodLength();
    moloch.proposalDeposit = contract.proposalDeposit();
    moloch.dilutionBound = contract.dilutionBound();
    moloch.processingReward = contract.processingReward();
    moloch.summoningTime = contract.summoningTime();
    moloch.createdAt = contract.summoningTime().toString();
    moloch.guildBankAddress = contract.guildBank();
    moloch.guildBankBalanceV1 = BigInt.fromI32(0);

    let address = changetype<Address>(moloch.guildBankAddress);
    // let gbContract = Guildbank.bind(moloch.guildBankAddress as Address);
    let gbContract = Guildbank.bind(address);

    let depositTokenAddress = gbContract.approvedToken();
    let approvedTokens: string[] = [];
    approvedTokens.push(createAndApproveToken(molochId, depositTokenAddress));
    moloch.approvedTokens = approvedTokens;
    moloch.depositToken = approvedTokens[0];

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
    member.loot = BigInt.fromI32(0);
    member.exists = true;
    member.tokenTribute = BigInt.fromI32(0);
    member.didRagequit = false;

    member.save();
    moloch.save();

    addTransaction(event.block, event.transaction);
  }
}

export function handleSubmitProposal(event: SubmitProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
    return;
  }

  let contract = Contract.bind(event.address);
  let proposalFromContract = contract.proposalQueue(event.params.proposalIndex);
  let startingPeriod = proposalFromContract.value3;
  let details = proposalFromContract.value10;
  let approvedToken = contract.approvedToken();

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
  proposal.createdBy = event.transaction.from;
  proposal.proposalIndex = event.params.proposalIndex;
  proposal.proposalId = event.params.proposalIndex;
  proposal.startingPeriod = startingPeriod;
  proposal.delegateKey = event.params.delegateKey;
  proposal.member = memberId;
  proposal.memberAddress = event.params.memberAddress;
  proposal.applicant = event.params.applicant;
  proposal.tributeOffered = event.params.tokenTribute;
  proposal.tributeToken = approvedToken;
  proposal.proposer = event.transaction.from;
  proposal.sharesRequested = event.params.sharesRequested;
  proposal.yesVotes = BigInt.fromI32(0);
  proposal.noVotes = BigInt.fromI32(0);
  proposal.yesShares = BigInt.fromI32(0);
  proposal.noShares = BigInt.fromI32(0);
  proposal.processed = false;
  proposal.didPass = false;
  proposal.aborted = false;
  proposal.details = details;
  proposal.sponsor = Address.fromString(ZERO_ADDRESS);
  proposal.sponsored = true;
  proposal.sponsoredAt = event.block.timestamp.toString();
  proposal.lootRequested = BigInt.fromI32(0);
  proposal.paymentRequested = BigInt.fromI32(0);
  proposal.paymentToken = Address.fromString(ZERO_ADDRESS);
  proposal.molochVersion = "1";
  proposal.isMinion = false;

  let votingPeriodStarts = moloch.summoningTime.plus(
    startingPeriod.times(moloch.periodDuration)
  );
  let votingPeriodEnds = votingPeriodStarts.plus(
    moloch.votingPeriodLength.times(moloch.periodDuration)
  );
  let gracePeriodEnds = votingPeriodEnds.plus(
    moloch.gracePeriodLength.times(moloch.periodDuration)
  );

  proposal.votingPeriodStarts = votingPeriodStarts;
  proposal.votingPeriodEnds = votingPeriodEnds;
  proposal.gracePeriodEnds = gracePeriodEnds;

  if (event.params.tokenTribute > BigInt.fromI32(0)) {
    let tokenId = molochId.concat("-token-").concat(approvedToken.toHex());
    let token = Token.load(tokenId);
    if (token) {
      proposal.tributeTokenSymbol = token.symbol;
      proposal.tributeTokenDecimals = token.decimals;
    }
  }

  proposal.save();

  addTransaction(event.block, event.transaction);
}

export function handleSubmitVote(event: SubmitVote): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
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

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  let member = Member.load(memberId);

  if (proposal == null || member == null) {
    return;
  }

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

  if (event.params.uintVote == 1) {
    let proposalYesVotes = proposal.yesVotes;
    let proposalYesShares = proposal.yesShares;
    proposal.yesVotes = proposalYesVotes.plus(BigInt.fromI32(1));
    proposal.yesShares = proposalYesShares.plus(member.shares);
  }
  if (event.params.uintVote == 2) {
    let proposalNoVotes = proposal.noVotes;
    let proposalNoShares = proposal.noShares;
    proposal.noVotes = proposalNoVotes.plus(BigInt.fromI32(1));
    proposal.noShares = proposalNoShares.plus(member.shares);
  }

  proposal.save();

  addTransaction(event.block, event.transaction);
}

export function handleProcessProposal(event: ProcessProposal): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
    return;
  }

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);

  if (proposal == null) {
    return;
  }
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
      newMember.loot = BigInt.fromI32(0);
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
    // moloch.guildBankBalanceV1 = getBalance(moloch.guildBankAddress as Address);
    let address = changetype<Address>(moloch.guildBankAddress);
    moloch.guildBankBalanceV1 = getBalance(address);

    moloch.save();
  }

  addTransaction(event.block, event.transaction);
}

export function handleRagequit(event: Ragequit): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let member = Member.load(memberId);

  if (member == null) {
    return;
  }
  member.shares = member.shares.minus(event.params.sharesToBurn);
  member.save();

  moloch.totalShares = moloch.totalShares.minus(event.params.sharesToBurn);
  // moloch.guildBankBalanceV1 = getBalance(moloch.guildBankAddress as Address);
  let address = changetype<Address>(moloch.guildBankAddress);
  moloch.guildBankBalanceV1 = getBalance(address);
  moloch.save();

  let rageQuitId = memberId
    .concat("-")
    .concat("rage-")
    .concat(event.block.number.toString());
  let rageQuit = new RageQuit(rageQuitId);
  rageQuit.createdAt = event.block.timestamp.toString();
  rageQuit.moloch = molochId;
  rageQuit.molochAddress = event.address;
  rageQuit.member = memberId;
  rageQuit.memberAddress = event.params.memberAddress;
  rageQuit.shares = event.params.sharesToBurn;
  rageQuit.loot = BigInt.fromI32(0);

  rageQuit.save();

  addTransaction(event.block, event.transaction);
}

export function handleAbort(event: Abort): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
    return;
  }

  let proposalId = molochId
    .concat("-proposal-")
    .concat(event.params.proposalIndex.toString());

  let proposal = Proposal.load(proposalId);
  if (proposal == null) {
    return;
  }
  proposal.aborted = true;
  proposal.save();

  addTransaction(event.block, event.transaction);
}

export function handleUpdateDelegateKey(event: UpdateDelegateKey): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null || moloch.newContract == "0") {
    return;
  }

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.memberAddress.toHex());

  let member = Member.load(memberId);
  if (member == null) {
    return;
  }
  member.delegateKey = event.params.newDelegateKey;
  member.save();

  addTransaction(event.block, event.transaction);
}
