import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { Badge } from "../generated/schema";

export function createOrUpdateVotedBadge(memberAddress: Bytes): void {
  let badge = Badge.load(memberAddress.toHex());
  if (badge == null) {
    badge = new Badge(memberAddress.toHex());
    badge.memberAddress = memberAddress;
    badge.voteCount = BigInt.fromI32(1);
  } else {
    badge.voteCount = badge.voteCount.plus(BigInt.fromI32(1));
  }
  badge.save();
}
