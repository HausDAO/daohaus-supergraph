import { BigInt, Bytes, EthereumTransaction } from "@graphprotocol/graph-ts";
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
    badge.proposalProcessorCount = BigInt.fromI32(0);
    badge.rageQuitCount = BigInt.fromI32(0);
    badge.jailedCount = BigInt.fromI32(0);
    badge.memberships = BigInt.fromI32(0);
    badge.dissents = BigInt.fromI32(0);
    badge.assents = BigInt.fromI32(0);
    badge.totalGas = BigInt.fromI32(0);

    badge.save();
  }

  return badge;
}

function addGas(currentGas: BigInt, tx: EthereumTransaction): BigInt {
  let txCost = tx.gasPrice.times(tx.gasUsed);
  return currentGas.plus(txCost);
}

export function addVotedBadge(
  memberAddress: Bytes,
  uintVote: number,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.voteCount = badge.voteCount.plus(BigInt.fromI32(1));
  badge.totalGas = addGas(badge.totalGas, tx);

  if (uintVote == 1) {
    badge.assents = badge.assents.plus(BigInt.fromI32(1));
  } else {
    badge.dissents = badge.dissents.plus(BigInt.fromI32(1));
  }

  badge.save();
}

export function addSummonBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.summonCount = badge.summonCount.plus(BigInt.fromI32(1));
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}

export function addMembershipBadge(memberAddress: Bytes): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.memberships = badge.memberships.plus(BigInt.fromI32(1));

  badge.save();
}

export function addRageQuitBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.rageQuitCount = badge.rageQuitCount.plus(BigInt.fromI32(1));
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}

export function addJailedCountBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.jailedCount = badge.jailedCount.plus(BigInt.fromI32(1));
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}

export function addProposalSubmissionBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.proposalSubmissionCount = badge.proposalSubmissionCount.plus(
    BigInt.fromI32(1)
  );
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}

export function addProposalSponsorBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.proposalSponsorCount = badge.proposalSponsorCount.plus(
    BigInt.fromI32(1)
  );
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}

export function addProposalProcessorBadge(
  memberAddress: Bytes,
  tx: EthereumTransaction
): void {
  let badge = loadOrCreateBadge(memberAddress);
  badge.proposalProcessorCount = badge.proposalProcessorCount.plus(
    BigInt.fromI32(1)
  );
  badge.totalGas = addGas(badge.totalGas, tx);

  badge.save();
}
