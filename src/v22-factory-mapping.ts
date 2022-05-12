import { BigInt, Address, log } from "@graphprotocol/graph-ts";
import { SummonComplete } from "../generated/V22Factory/V22Factory";
import { MolochV22Template } from "../generated/templates";

import { Moloch, Member, DaoMeta, SafeMinion } from "../generated/schema";

import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance,
} from "./v2-mapping";
import { addTransaction } from "./transactions";

// event SummonComplete(
//   address indexed moloch,
//   address _summoner,
//   address _shaman,
//   address[] tokens,
//   uint256 summoningTime,
//   uint256 periodDuration,
//   uint256 votingPeriodLength,
//   uint256 gracePeriodLength,
//   uint256 proposalDeposit,
//   uint256 dilutionBound,
//   uint256 processingReward
// );

export function handleSummonV22(event: SummonComplete): void {
  MolochV22Template.create(event.params.moloch);
  let molochId = event.params.moloch.toHexString();
  let moloch = new Moloch(molochId);

  let daoMeta = new DaoMeta(event.params.moloch.toHex());
  daoMeta.version = "2.2";
  daoMeta.newContract = "1";
  daoMeta.save();

  let creator: Address = event.params._summoner;
  moloch.summoner = creator;

  // create summoner with 0 shares
  createAndAddSummoner(molochId, creator, BigInt.fromI32(0), event);

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
  moloch.version = "2.2";
  moloch.periodDuration = event.params.periodDuration;
  moloch.votingPeriodLength = event.params.votingPeriodLength;
  moloch.gracePeriodLength = event.params.gracePeriodLength;
  moloch.proposalDeposit = event.params.proposalDeposit;
  moloch.dilutionBound = event.params.dilutionBound;
  moloch.processingReward = event.params.processingReward;
  moloch.approvedTokens = approvedTokens;
  moloch.depositToken = approvedTokens[0];
  moloch.totalLoot = BigInt.fromI32(0);
  moloch.totalShares = BigInt.fromI32(0);
  moloch.v22Setup = false;
  moloch.spamPreventionAmount = BigInt.fromI32(0);

  moloch.save();

  addTransaction(event.block, event.transaction);
}

// used to create multiple summoners at time of summoning
export function createAndAddSummoner(
  molochId: string,
  summoner: Address,
  shares: BigInt,
  event: SummonComplete
): string {
  let memberId = molochId.concat("-member-").concat(summoner.toHex());

  let member = new Member(memberId);

  member.moloch = molochId;
  member.createdAt = event.block.timestamp.toString();
  member.molochAddress = event.params.moloch;
  member.memberAddress = summoner;
  member.delegateKey = summoner;
  member.shares = shares;
  member.loot = BigInt.fromI32(0);
  member.tokenTribute = BigInt.fromI32(0);
  member.didRagequit = false;
  member.exists = true;
  member.proposedToKick = false;
  member.kicked = false;
  member.isDao = Moloch.load(summoner.toHex()) ? summoner.toHexString() : null;
  member.isSafeMinion = SafeMinion.load(summoner.toHex()) ? summoner.toHexString() : null;

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

  return memberId;
}
