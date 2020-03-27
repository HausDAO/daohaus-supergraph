import { BigInt, log } from "@graphprotocol/graph-ts";
import { Register as RegisterV1 } from "../generated/V1Factory/V1Factory";
import {
  Register as RegisterV2,
  Delete
} from "../generated/V2Factory/V2Factory";

// import { Dao } from "../generated/schema";
// import { MolochTemplate } from "../generated/templates";
import { Moloch, Member } from "../generated/schema";

import {
  createAndApproveToken,
  createEscrowTokenBalance,
  createGuildTokenBalance,
  createMemberTokenBalance
} from "./moloch-mapping";

export function handleRegisterV1(event: RegisterV1): void {
  // let entity = Dao.load(event.params.moloch.toHexString());
  // if (entity == null) {
  //   entity = new Dao(event.params.moloch.toHexString());
  // }
  // entity.moloch = event.params.moloch;
  // entity.createdAt = event.block.timestamp.toString();
  // entity.summoner = event.params.summoner;
  // entity.title = event.params.title;
  // entity.index = event.params.daoIdx.toString();
  // entity.newContract = event.params.newContract.toString();
  // // TODO FOR TEMPLATES
  // // Moloch.create(event.params.moloch);
  // entity.save();

  let molochId = event.params.moloch.toHex();
  let moloch = new Moloch(molochId);
  moloch.summoner = event.params.summoner;
  moloch.title = event.params.title;
  moloch.newContract = event.params.newContract.toString();

  moloch.save();
}

export function handleRegisterV2(event: RegisterV2): void {
  // let entity = Dao.load(event.params.moloch.toHexString());

  // log.info("**************** event fired. contract address: {}", [
  //   event.params.moloch.toHexString()
  // ]);

  // if (entity == null) {
  //   entity = new Dao(event.params.moloch.toHexString());
  // }

  // entity.moloch = event.params.moloch;
  // entity.createdAt = event.block.timestamp.toString();
  // entity.summoner = event.params.summoner;
  // entity.title = event.params.title;
  // entity.index = event.params.daoIdx.toString();
  // entity.version = event.params.version.toString();

  // // TODO FOR TEMPLATES
  // // MolochTemplate.create(event.params.moloch);

  // entity.save();

  // let molochId = event.address.toHex();
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

  // Start new Moloch instance
  moloch.summoner = event.params.summoner;
  moloch.summoningTime = event.params._summoningTime;
  moloch.title = event.params.title;

  // NEED THIS?
  // moloch.newContract = "1";
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
  moloch.currentPeriod = BigInt.fromI32(0);
  moloch.totalShares = BigInt.fromI32(1);
  moloch.totalLoot = BigInt.fromI32(0);
  moloch.proposalCount = BigInt.fromI32(0);
  moloch.proposalQueueCount = BigInt.fromI32(0);
  moloch.proposedToJoin = new Array<string>();
  moloch.proposedToWhitelist = new Array<string>();
  moloch.proposedToKick = new Array<string>();
  moloch.proposedToFund = new Array<string>();
  moloch.proposedToTrade = new Array<string>();

  log.info("SAVING MOLOCH {}", [molochId]);

  moloch.save();

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
  // TODO cant delete a MolochTemplate - maybe need to track this on the moloch entity
}
