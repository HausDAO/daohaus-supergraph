import { SetupComplete } from "../generated/V22AndSafeMinionFactory/V22AndSafeMinionFactory";
import { Moloch, Member } from "../generated/schema";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { addTransaction } from "./transactions";

function loadOrCreateSummonerV22(
  molochId: string,
  summoner: Address,
  shares: BigInt,
  loot: BigInt,
  event: SetupComplete
): string {
  let memberId = molochId.concat("-member-").concat(summoner.toHex());

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
    member.shares = shares;
  } else {
    member.shares = member.shares.plus(shares);
  }

  member.loot = loot;

  // Leaving this out as all token balances will be 0
  // let tokens: string[] = [];
  // if (moloch) {
  //   tokens = moloch.tokens;
  // }

  // for (let i = 0; i < tokens.length; i++) {
  //   let token = tokens[i];
  //   let tokenId = molochId.concat("-token-").concat(token);
  //   createMemberTokenBalance(
  //     molochId,
  //     member.memberAddress,
  //     tokenId,
  //     BigInt.fromI32(0)
  //   );
  // }

  member.save();

  return memberId;
}

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

  if (moloch == null) {
    return;
  }
  let eventSummoners: Address[] = event.params.summoners;
  let summoners: string[] = [];

  let eventSummonerShares = event.params.summonerShares;
  let eventSummonerLoot = event.params.summonerLoot;

  let mTotalShares = moloch.totalShares;
  let mTotalLoot = moloch.totalLoot;

  let summonerAddress = changetype<Address>(moloch.summoner);
  loadOrCreateSummonerV22(
    molochId,
    summonerAddress,
    BigInt.fromI32(1),
    BigInt.fromI32(0),
    event
  );

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

  moloch.v22Setup = true;
  moloch.totalShares = mTotalShares;
  moloch.totalLoot = mTotalLoot;

  moloch.save();

  addTransaction(event.block, event.transaction);
}
