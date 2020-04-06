import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Badge } from "../generated/schema";

function loadOrCreateBadge(memberAddress: Bytes): Badge | null {
  let badge = Badge.load(memberAddress.toHex());
  if (badge == null) {
    badge = new Badge(memberAddress.toHex());
    badge.memberAddress = memberAddress;

    badge.voteCount = BigInt.fromI32(0);
    badge.summonCount = BigInt.fromI32(0);
    badge.proposalSponsorCount = BigInt.fromI32(0);
    badge.proposalSubmissionCount = BigInt.fromI32(0);
    // badge.proposalSubmissionNewMemberCount = BigInt.fromI32(0);
    // badge.proposalSubmissionTradeCount = BigInt.fromI32(0);
    // badge.proposalSubmissionWhitelistCount = BigInt.fromI32(0);
    // badge.proposalSubmissionGuildkicktCount = BigInt.fromI32(0);
    badge.rageQuitCount = BigInt.fromI32(0);
    badge.jailedCount = BigInt.fromI32(0);

    badge.save();
  }

  return badge;
}

export function addVotedBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.voteCount = badge.voteCount.plus(BigInt.fromI32(1));

  badge.save();
}

export function addSummonBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.summonCount = badge.summonCount.plus(BigInt.fromI32(1));

  badge.save();
}

export function addRageQuitBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.rageQuitCount = badge.rageQuitCount.plus(BigInt.fromI32(1));

  badge.save();
}

export function addJailedCountBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.jailedCount = badge.jailedCount.plus(BigInt.fromI32(1));

  badge.save();
}

export function addProposalSubmissionBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.proposalSubmissionCount = badge.proposalSubmissionCount.plus(
    BigInt.fromI32(1)
  );

  badge.save();
}

export function addProposalSponsorBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.proposalSponsorCount = badge.proposalSponsorCount.plus(
    BigInt.fromI32(1)
  );

  badge.save();
}
