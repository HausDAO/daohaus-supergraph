import {
  SummonComplete,
  SetupComplete,
} from "../generated/V22AndSafeMinionFactory/V22AndSafeMinionFactory";
import { Shaman, Moloch, Member } from "../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createMemberTokenBalance } from "./v2-mapping";
import { addTransaction } from "./transactions";

function createAndAddSummonerV22(
  molochId: string,
  summoner: Address,
  shares: BigInt,
  loot: BigInt,
  event: SetupComplete
): string {
  let memberId = molochId.concat("-member-").concat(summoner.toHex());
  let member = new Member(memberId);

  let moloch = Moloch.load(molochId);

  member.moloch = molochId;
  member.createdAt = event.block.timestamp.toString();
  member.molochAddress = event.params._moloch;
  member.memberAddress = summoner;
  member.delegateKey = summoner;
  member.shares = shares;
  member.loot = loot;
  member.tokenTribute = BigInt.fromI32(0);
  member.didRagequit = false;
  member.exists = true;
  member.proposedToKick = false;
  member.kicked = false;

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
//     address summoner,
//     address indexed moloch,
//     address _minion,
//     address _avatar,
//     string details
// );
export function handleSummonComplete(event: SummonComplete): void {
  let molochId = event.params.moloch.toHexString();

  let shamanId = molochId
    .concat("-shaman-")
    .concat(event.params._minion.toHex());
  let shaman = new Shaman(shamanId);

  shaman.createdAt = event.block.timestamp.toString();
  shaman.shamanAddress = event.params._minion;
  shaman.molochAddress = event.params.moloch;
  shaman.moloch = molochId;
  shaman.details = event.params.details;
  shaman.shamanType = "safe minion";
  shaman.details = event.params.details;
  shaman.safeAddress = event.params._avatar;

  shaman.save();

  addTransaction(event.block, event.transaction);
}

// event SetupComplete(
//     address indexed _moloch,
//     address _shaman,
//     address[] _summoners,
//     uint256[] _summonerShares,
//     uint256[] _summonerLoot
// );
export function handleSetupComplete(event: SetupComplete): void {
  // create summoners w/ shares loot
  let molochId = event.params._moloch.toHexString();
  let moloch = Moloch.load(molochId);

  let eventSummoners: Address[] = event.params._summoners;
  let summoners: string[] = [];

  let eventSummonerShares = event.params._summonerShares;
  let eventSummonerLoot = event.params._summonerLoot;

  let mTotalShares = moloch.totalShares;
  let mTotalLoot = moloch.totalLoot;

  for (let i = 0; i < eventSummoners.length; i++) {
    let summoner = eventSummoners[i];
    let shares = eventSummonerShares[i];
    let loot = eventSummonerLoot[i];
    mTotalShares = mTotalShares.plus(shares);
    mTotalLoot = mTotalLoot.plus(loot);

    summoners.push(
      createAndAddSummonerV22(molochId, summoner, shares, loot, event)
    );
  }

  // do we need token balances?

  moloch.v22Setup = true;

  moloch.save();

  addTransaction(event.block, event.transaction);
}
