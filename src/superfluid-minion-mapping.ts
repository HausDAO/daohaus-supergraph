import { log, store } from "@graphprotocol/graph-ts";
import { Minion, MinionStream, Proposal } from "../generated/schema";
import {
  ExecuteStream,
  ProposeStream,
  StreamCanceled,
  ActionCanceled,
  SuperfluidMinion,
} from "../generated/templates/SuperfluidMinionTemplate/SuperfluidMinion";
import { addTransaction } from "./transactions";

export function handleProposedStream(event: ProposeStream): void {
  log.info("Running handleProposedStream: {}", [event.address.toHexString()]);
  let contract = SuperfluidMinion.bind(event.address);
  let molochAddress = contract.try_moloch();
  let result = contract.try_streams(event.params.proposalId);
  if (result.reverted || molochAddress.reverted) {
    log.info(
      "^^^^^ handleProposedStream contract call reverted. streams: {} - moloch: {}",
      [
        result.reverted ? "reverted" : "ok",
        molochAddress.reverted ? "reverted" : "ok",
      ]
    );
    return;
  }

  let minionAddress = event.address.toHexString();

  let streamId = minionAddress
    .concat("-stream-")
    .concat(event.params.proposalId.toString());
  log.info("handleProposedStream New ID: {}", [streamId]);

  let minionId = molochAddress.value
    .toHexString()
    .concat("-minion-")
    .concat(minionAddress);
  let minion = Minion.load(minionId);

  log.info("Running handleProposedStream => minion ID {}", [minion.id]);

  let processProposalId = molochAddress.value
    .toHexString()
    .concat("-proposal-")
    .concat(event.params.proposalId.toString());
  let proposal = Proposal.load(processProposalId);
  log.info("Running handleProposedStream => proposal ID {}", [proposal.id]);

  proposal.isMinion = true;
  proposal.minionAddress = event.address;
  proposal.minion = minion.id;
  proposal.proposer = contract._address; // Minion
  proposal.save();

  let stream = new MinionStream(streamId);
  stream.proposalId = event.params.proposalId.toString();
  stream.createdAt = event.block.timestamp.toString();
  stream.to = result.value.value0;
  stream.tokenAddress = result.value.value1;
  stream.superTokenAddress = result.value.value2;
  stream.rate = result.value.value3;
  stream.minDeposit = result.value.value4;
  stream.proposer = result.value.value5;
  stream.executed = result.value.value6;
  stream.active = result.value.value7;
  stream.ctx = result.value.value8;
  stream.minion = minion.id;

  log.info("&&&&& handleProposedStream minionId: {}, streamId: {}", [
    minionId,
    streamId,
  ]);

  stream.save();

  addTransaction(event.block, event.transaction);
}

export function handleExecutedStream(event: ExecuteStream): void {
  let minionAddress = event.address.toHexString();
  let streamId = minionAddress
    .concat("-stream-")
    .concat(event.params.proposalId.toString());
  log.info("Running handleExecutedStream: {} => {}", [
    event.address.toHexString(),
    streamId,
  ]);
  let stream = MinionStream.load(streamId);
  if (stream == null) {
    log.info("handleExecutedStream not found! {}", [streamId]);
    return;
  }

  let contract = SuperfluidMinion.bind(event.address);
  let result = contract.try_streams(event.params.proposalId);
  if (result.reverted) {
    log.info(
      "^^^^^ handleProposedStream contract call reverted. streams: {} - moloch: {}",
      [result.reverted ? "reverted" : "ok"]
    );
    return;
  }

  log.info("&&&&& handleExecutedStream streamId: {}", [streamId]);
  stream.executed = true;
  stream.executedBlock = event.block.number;
  stream.executedAt = event.block.timestamp.toString();
  stream.active = true;
  stream.superTokenAddress = result.value.value2;
  stream.execTxHash = event.transaction.hash;
  stream.save();

  addTransaction(event.block, event.transaction);
}

export function handleStreamCanceled(event: StreamCanceled): void {
  let minionAddress = event.address.toHexString();
  let streamId = minionAddress
    .concat("-stream-")
    .concat(event.params.proposalId.toString());
  log.info("Running handleStreamCanceled: {} => {}", [
    event.address.toHexString(),
    streamId,
  ]);
  let stream = MinionStream.load(streamId);
  if (stream == null) {
    log.info("handleStreamCanceled not found! {}", [streamId]);
    return;
  }
  log.info("&&&&& handleStreamCanceled streamId: {}", [streamId]);
  stream.active = false;
  stream.canceledBy = event.params.canceledBy;
  stream.canceledAt = event.block.timestamp.toString();
  stream.save();

  addTransaction(event.block, event.transaction);
}

export function handleStreamProposalCanceled(event: ActionCanceled): void {
  let minionAddress = event.address.toHexString();
  let streamId = minionAddress
    .concat("-stream-")
    .concat(event.params.proposalId.toString());
  store.remove("MinionStream", streamId);

  addTransaction(event.block, event.transaction);
}
