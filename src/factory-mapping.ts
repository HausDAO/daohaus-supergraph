import { BigInt, log } from "@graphprotocol/graph-ts";
import { Register as RegisterV1 } from "../generated/V1Factory/V1Factory";
import {
  Register as RegisterV2,
  Delete
} from "../generated/V2Factory/V2Factory";

import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { Moloch, Member } from "../generated/schema";

import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance
} from "./v2-mapping";
import { addSummonBadge } from "./badges";

export function handleRegisterV1(event: RegisterV1): void {
  MolochV1Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
  moloch.summoner = event.params.summoner;
  moloch.title = event.params.title;
  moloch.newContract = event.params.newContract.toString();
  moloch.version = "1";
  moloch.deleted = false;

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
}

export function handleRegisterV2(event: RegisterV2): void {
  MolochV2Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
  let tokens = event.params.tokens;
  let approvedTokens: string[] = [];

  let escrowTokenBalance: string[] = [];
  let guildTokenBalance: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];
    approvedTokens.push(createAndApproveToken(molochId, token));
    escrowTokenBalance.push(createEscrowTokenBalance(molochId, token));
    guildTokenBalance.push(createGuildTokenBalance(molochId, token));
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
  moloch.guildTokenBalance = guildTokenBalance;
  moloch.escrowTokenBalance = escrowTokenBalance;
  moloch.totalShares = BigInt.fromI32(1);
  moloch.totalLoot = BigInt.fromI32(0);
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.proposalQueueCount = BigInt.fromI32(0);
  moloch.proposedToJoin = new Array<string>();
  moloch.proposedToWhitelist = new Array<string>();
  moloch.proposedToKick = new Array<string>();
  moloch.proposedToFund = new Array<string>();
  moloch.proposedToTrade = new Array<string>();

  moloch.save();

  addSummonBadge(event.params.summoner);

  //Create member for summoner
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
  //Set summoner summoner balances for approved tokens to zero
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

export function handleDelete(event: Delete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.deleted = true;
  moloch.save();
}
