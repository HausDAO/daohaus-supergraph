import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import { Register as RegisterV1 } from "../generated/V1Factory/V1Factory";
import {
  Register as RegisterV2,
  Delete,
} from "../generated/V2Factory/V2Factory";
import {
  SummonComplete,
  Register as RegisterV21,
} from "../generated/V21Factory/V21Factory";
import {
  MolochV1Template,
  MolochV21Template,
  MolochV2Template,
} from "../generated/templates";

import { Moloch, Member, DaoMeta } from "../generated/schema";

import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance,
} from "./v2-mapping";
import { addTransaction } from "./transactions";

export function handleRegisterV1(event: RegisterV1): void {
  if (event.params.newContract.toString() == "0") {
    return;
  }

  MolochV1Template.create(event.params.moloch);

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.title = event.params.title;
  daoMeta.version = "1";
  daoMeta.newContract = event.params.newContract.toString();
  daoMeta.save();

  addTransaction(event.block, event.transaction);
}

export function handleRegisterV2(event: RegisterV2): void {
  // testing
  MolochV2Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.title = event.params.title;
  daoMeta.version = "2";
  daoMeta.newContract = "1";
  daoMeta.save();

  let tokens = event.params.tokens;
  let approvedTokens: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    approvedTokens.push(createAndApproveToken(molochId, token));
    createEscrowTokenBalance(molochId, token);
    createGuildTokenBalance(molochId, token);
  }

  moloch.summoner = event.params.summoner;
  moloch.summoningTime = event.params._summoningTime;
  moloch.createdAt = event.params._summoningTime.toString();
  moloch.version = "2";
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.periodDuration = event.params._periodDuration;
  moloch.votingPeriodLength = event.params._votingPeriodLength;
  moloch.gracePeriodLength = event.params._gracePeriodLength;
  moloch.proposalDeposit = event.params._proposalDeposit;
  moloch.dilutionBound = event.params._dilutionBound;
  moloch.processingReward = event.params._processingReward;
  moloch.depositToken = approvedTokens[0];
  moloch.approvedTokens = approvedTokens;
  moloch.totalShares = BigInt.fromI32(1);
  moloch.totalLoot = BigInt.fromI32(0);

  moloch.save();

  let memberId = molochId
    .concat("-member-")
    .concat(event.params.summoner.toHex());
  let newMember = new Member(memberId);
  newMember.moloch = molochId;
  newMember.molochAddress = event.params.moloch;
  newMember.memberAddress = event.params.summoner;
  newMember.createdAt = event.block.timestamp.toString();
  newMember.delegateKey = event.params.summoner;
  newMember.shares = BigInt.fromI32(1);
  newMember.loot = BigInt.fromI32(0);
  newMember.exists = true;
  newMember.tokenTribute = BigInt.fromI32(0);
  newMember.didRagequit = false;
  newMember.proposedToKick = false;
  newMember.kicked = false;

  newMember.save();

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let tokenId = molochId.concat("-token-").concat(token.toHex());
    createMemberTokenBalance(
      molochId,
      event.params.summoner,
      tokenId,
      BigInt.fromI32(0)
    );
  }

  addTransaction(event.block, event.transaction);
}

export function handleSummonV21(event: SummonComplete): void {
  MolochV21Template.create(event.params.moloch);
  let molochId = event.params.moloch.toHexString();
  let moloch = new Moloch(molochId);

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.version = "2.1";
  daoMeta.newContract = "1";
  daoMeta.save();

  let eventSummoners: Address[] = event.params.summoner;
  let summoners: string[] = [];
  let creator: Address = eventSummoners[0];
  moloch.summoner = creator;

  let eventSummonerShares = event.params.summonerShares;
  moloch.totalShares = BigInt.fromI32(0);
  let mTotalShares = moloch.totalShares;
  for (let i = 0; i < eventSummoners.length; i++) {
    let summoner = eventSummoners[i];
    let shares = eventSummonerShares[i];
    mTotalShares = mTotalShares.plus(shares);

    summoners.push(createAndAddSummoner(molochId, summoner, shares, event));
  }

  let tokens = event.params.tokens;
  let approvedTokens: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    approvedTokens.push(createAndApproveToken(molochId, token));
    createEscrowTokenBalance(molochId, token);
    createGuildTokenBalance(molochId, token);
  }

  moloch.summoningTime = event.params.summoningTime;
  moloch.createdAt = event.params.summoningTime.toString();
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.version = "2.1";
  moloch.periodDuration = event.params.periodDuration;
  moloch.votingPeriodLength = event.params.votingPeriodLength;
  moloch.gracePeriodLength = event.params.gracePeriodLength;
  moloch.proposalDeposit = event.params.proposalDeposit;
  moloch.dilutionBound = event.params.dilutionBound;
  moloch.processingReward = event.params.processingReward;
  moloch.approvedTokens = approvedTokens;
  moloch.depositToken = approvedTokens[0];
  moloch.totalLoot = BigInt.fromI32(0);
  moloch.totalShares = mTotalShares;

  moloch.save();

  addTransaction(event.block, event.transaction);
}

export function handleRegisterV21(event: RegisterV21): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);

  if (moloch) {
    moloch.version = event.params.version.toString();
    moloch.save();
  }

  let daoMeta = DaoMeta.load(event.params.moloch.toHex());
  if (daoMeta) {
    daoMeta.title = event.params.title;
    daoMeta.version = event.params.version.toString();
    daoMeta.newContract = event.params.daoIdx.toString();
    daoMeta.http = event.params.http.toString();

    daoMeta.save();
  }

  addTransaction(event.block, event.transaction);
}

export function handleDelete(event: Delete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  if (moloch) {
    moloch.deleted = true;
    moloch.save();

    addTransaction(event.block, event.transaction);
  }
}

// used to create multiple summoners at time of summoning
export function createAndAddSummoner(
  molochId: string,
  summoner: Address,
  shares: BigInt,
  event: SummonComplete
): string {
  let memberId = molochId.concat("-member-").concat(summoner.toHex());
  let moloch = Moloch.load(molochId);
  let member = new Member(memberId);

  member.moloch = molochId;
  member.createdAt = event.block.timestamp.toString();
  log.info("*** Member CreatedAt {}***", [member.createdAt.toString()]);
  member.molochAddress = event.params.moloch;
  member.memberAddress = summoner;
  member.delegateKey = summoner;
  member.shares = shares;
  log.info("*** Member Shares {}***", [member.shares.toString()]);
  member.loot = BigInt.fromI32(0);
  member.tokenTribute = BigInt.fromI32(0);
  member.didRagequit = false;
  member.exists = true;
  member.proposedToKick = false;
  member.kicked = false;

  //Set summoner summoner balances for approved tokens to zero
  let tokens = event.params.tokens;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    let tokenId = molochId.concat("-token-").concat(token.toHex());
    createMemberTokenBalance(
      molochId,
      member.memberAddress,
      tokenId,
      BigInt.fromI32(0)
    );
  }

  member.save();

  // moloch.totalShares = moloch.totalShares.plus(shares);
  // moloch.save();

  return memberId;
}
