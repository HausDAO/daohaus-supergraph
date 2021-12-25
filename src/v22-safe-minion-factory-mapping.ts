import {
  SummonComplete,
  SetupComplete,
} from "../generated/V22AndSafeMinionFactory/V22AndSafeMinionFactory";
import { Shaman, Moloch, Member } from "../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createMemberTokenBalance } from "./v2-mapping";
import { addTransaction } from "./transactions";

function loadOrCreateSummonerV22(
  molochId: string,
  summoner: Address,
  shares: BigInt,
  loot: BigInt,
  event: SetupComplete
): string {
  let memberId = molochId.concat("-member-").concat(summoner.toHex());
  let moloch = Moloch.load(molochId);

  let member = Member.load(memberId);

  if (member === null) {
    member = new Member(memberId);

    member.moloch = molochId;
    member.createdAt = event.block.timestamp.toString();
    member.molochAddress = event.params.moloch;
    member.memberAddress = summoner;
    member.delegateKey = summoner;
    member.tokenTribute = BigInt.fromI32(0);
    member.didRagequit = false;
    member.exists = true;
    member.proposedToKick = false;
    member.kicked = false;
  }

  member.shares = shares;
  member.loot = loot;

  //this tokens array might be tokenIds
  let tokens = moloch.tokens as string[];

  for (let i = 0; i < tokens.length; i++) {
    // let token = tokens[i];
    // let tokenId = molochId.concat("-token-").concat(token);
    let tokenId = tokens[i] as string;
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

// event SummonComplete(
//   address summoner,
//   address indexed moloch,
//   address minion,
//   address avatar,
//   string details
// );
export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.params.moloch.toHexString();

  let shamanId = molochId
    .concat("-shaman-")
    .concat(event.params.minion.toHex());
  let shaman = new Shaman(shamanId);

  shaman.createdAt = event.block.timestamp.toString();
  shaman.shamanAddress = event.params.minion;
  shaman.molochAddress = event.params.moloch;
  shaman.moloch = molochId;
  shaman.details = event.params.details;
  shaman.shamanType = "safe minion";
  shaman.details = event.params.details;
  shaman.safeAddress = event.params.avatar;

  shaman.save();

  addTransaction(event.block, event.transaction);
}

// shamans always created in factory before setshaman event

// event SetupComplete(
//   address indexed moloch,
//   address shaman,
//   address[] extraShamans,
//   address[] summoners,
//   uint256[] summonerShares,
//   uint256[] summonerLoot
// );
export function handleSetupComplete(event: SetupComplete): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);

  let eventSummoners: Address[] = event.params.summoners;
  let summoners: string[] = [];

  let eventSummonerShares = event.params.summonerShares;
  let eventSummonerLoot = event.params.summonerLoot;

  let mTotalShares = moloch.totalShares;
  let mTotalLoot = moloch.totalLoot;

  for (let i = 0; i < eventSummoners.length; i++) {
    let summoner = eventSummoners[i];
    let shares = eventSummonerShares[i];
    let loot = eventSummonerLoot[i];
    mTotalShares = mTotalShares.plus(shares);
    mTotalLoot = mTotalLoot.plus(loot);

    summoners.push(
      loadOrCreateSummonerV22(molochId, summoner, shares, loot, event)
    );
  }

  // do we need to do anything with extraShamans;

  moloch.v22Setup = true;

  moloch.save();

  addTransaction(event.block, event.transaction);
}

// yeeter
//  event SummonYeetComplete(
//   address indexed moloch,
//   address yeeter,
//   address wrapper,
//   uint256 maxTarget,
//   uint256 raiseEndTime,
//   uint256 raiseStartTime,
//   uint256 maxUnits,
//   uint256 pricePerUnit,
//   string details
// );

// summoner will get one and extra if needed

// 1. moloch factory summonComplete - moloch mapping - w/out summoner shares
// 2. safemin factory - normal minion mapping
// 3. v22safeminfactory summonComplete - add minion as a shaman
// 4. shamana factories (yeeter in this case) - adds shaman to moloch
// 5. v22safeminfactory SetupComplete - moloch v22 setupComplete flag, summoner gets 1 share, other summoners get shares
// // need to check if member is created here - summoner might be there but with no shares
