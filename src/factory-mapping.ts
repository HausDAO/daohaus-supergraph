import { BigInt, Address } from "@graphprotocol/graph-ts";
import { Register as RegisterV1 } from "../generated/V1Factory/V1Factory";
import {
  Register as RegisterV2,
  Delete,
} from "../generated/V2Factory/V2Factory";
import { V1Moloch } from "../generated/templates/MolochV1Template/V1Moloch";
import { Guildbank } from "../generated/templates/MolochV1Template/Guildbank";
import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { Moloch, Member } from "../generated/schema";
import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance,
} from "./v2-mapping";

//TODO: When to do the summon stuff here?
// shoud be on v1, then legacy will still hit the normal template mapping

export function handleRegisterV1(event: RegisterV1): void {
  if (event.params.newContract.toString() == "0") {
    return;
  }
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
  moloch.proposalDeposit = BigInt.fromI32(0);
  moloch.dilutionBound = BigInt.fromI32(0);
  moloch.processingReward = BigInt.fromI32(0);

  let approvedTokens: string[] = [];
  moloch.approvedTokens = approvedTokens;

  let contract = V1Moloch.bind(event.params.moloch);
  moloch.periodDuration = contract.periodDuration();
  moloch.votingPeriodLength = contract.votingPeriodLength();
  moloch.gracePeriodLength = contract.gracePeriodLength();
  moloch.proposalDeposit = contract.proposalDeposit();
  moloch.dilutionBound = contract.dilutionBound();
  moloch.processingReward = contract.processingReward();
  moloch.summoningTime = contract.summoningTime();
  moloch.guildBankAddress = contract.guildBank();
  moloch.guildBankBalanceV1 = BigInt.fromI32(0);

  let gbContract = Guildbank.bind(moloch.guildBankAddress as Address);
  let depositTokenAddress = gbContract.approvedToken();
  approvedTokens.push(createAndApproveToken(molochId, depositTokenAddress));
  moloch.depositToken = approvedTokens[0];

  moloch.save();
}

export function handleRegisterV2(event: RegisterV2): void {
  MolochV2Template.create(event.params.moloch);

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
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

export function handleDelete(event: Delete): void {
  let molochId = event.address.toHexString();
  let moloch = Moloch.load(molochId);
  moloch.deleted = true;
  moloch.save();
}
