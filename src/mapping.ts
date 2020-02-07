import { BigInt, log } from "@graphprotocol/graph-ts";
import { Contract, Register } from "../generated/Contract/Contract";
import { MolochV2 } from "../generated/schema";

export function handleRegister(event: Register): void {
  let entity = MolochV2.load(event.params.moloch.toHexString());

  log.info("**************** event fired. contract address: {}", [
    event.params.moloch.toHexString()
  ]);

  if (entity == null) {
    entity = new MolochV2(event.params.moloch.toHexString());
    entity.count = BigInt.fromI32(0);
  }

  entity.count = entity.count + BigInt.fromI32(1);

  entity.moloch = event.params.moloch;
  entity.summoner = event.params.summoner;
  entity.title = event.params.title;
  entity.index = event.params.daoIdx.toString();
  entity.newContract = event.params.newContract.toString();
  entity.version = event.params.version.toString();

  entity.save();
}
