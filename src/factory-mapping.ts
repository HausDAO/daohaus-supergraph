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
  MolochV2Template,
  MolochV21Template,
} from "../generated/templates";

import { Moloch, Member, DaoMeta } from "../generated/schema";

import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance,
} from "./v2-mapping";

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
}

export function handleRegisterV2(event: RegisterV2): void {
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
  moloch.title = event.params.title;
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
}

export function handleSummonV21(event: SummonComplete): void {
  MolochV21Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  log.info("*** New MolochId {}***", [molochId]);
  let moloch = new Moloch(molochId);

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.version = "21";
  log.info("*** DAO Version {}***", [daoMeta.version.toString()]);
  daoMeta.newContract = "1";
  daoMeta.save();

  let eventSummoners = event.params.summoner;
  log.info("*** Summoner 1 {}, Summoner 2 {}***", [eventSummoners.toString()]);

  let summoners: string[] = [];
  let creator = eventSummoners[0];
  moloch.summoner = creator;
  log.info("*** Moloch Summoner {}***", [moloch.summoner.toString()]);

  let eventSummonerShares = event.params.summonerShares;
  log.info("*** Summoner 1 Shares {}, Summoner 2 Shares {}***", [
    eventSummonerShares.toString(),
  ]);

  moloch.totalShares = BigInt.fromI32(0);
  let mTotalShares = moloch.totalShares;
  log.info("*** Total Shares {}***", [mTotalShares.toString()]);

  for (let i = 0; i < eventSummoners.length; i++) {
    let summoner = eventSummoners[i];

    for (let i = 0; i < eventSummonerShares.length; i++) {
      let shares = eventSummonerShares[i];
      mTotalShares = mTotalShares.plus(shares);

      summoners.push(createAndAddSummoner(molochId, summoner, shares, event));
    }
  }

  let tokens = event.params.tokens;
  log.info("*** Token One {}, Token Two {}***", [
    event.params.tokens.toString(),
  ]);
  let approvedTokens: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    approvedTokens.push(createAndApproveToken(molochId, token));
    createEscrowTokenBalance(molochId, token);
    createGuildTokenBalance(molochId, token);
  }

  moloch.summoningTime = event.params.summoningTime;
  moloch.deleted = false;
  moloch.newContract = "1";
  moloch.periodDuration = event.params.periodDuration;
  moloch.votingPeriodLength = event.params.votingPeriodLength;
  moloch.gracePeriodLength = event.params.gracePeriodLength;
  moloch.proposalDeposit = event.params.proposalDeposit;
  log.info("*** Moloch proposalDeposit {}***", [
    moloch.proposalDeposit.toString(),
  ]);
  moloch.dilutionBound = event.params.dilutionBound;
  moloch.processingReward = event.params.processingReward;
  moloch.approvedTokens = approvedTokens;
  moloch.depositToken = approvedTokens[0];
  moloch.totalLoot = BigInt.fromI32(0);
  log.info("*** Moloch Loot {}***", [moloch.totalLoot.toString()]);

  moloch.save();
}

export function handleRegisterV21(event: RegisterV21): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);

  moloch.title = event.params.title;
  moloch.version = event.params.version.toString();
  log.info("*** Moloch Version {}***", [moloch.version.toString()]);
  moloch.save();

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.title = event.params.title;
  log.info("*** datMeta {}***", [daoMeta.title.toString()]);
  daoMeta.version = event.params.version.toString();
  daoMeta.newContract = event.params.daoIdx.toString();
  daoMeta.http = event.params.http.toString();
  daoMeta.save();
}

export function handleDelete(event: Delete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.deleted = true;
  moloch.save();
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
