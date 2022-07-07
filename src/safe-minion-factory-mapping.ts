import { Bytes, log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/SafeMinionFactory/SafeMinionFactory";
import { SafeMinionTemplate } from "../generated/templates";
import { Moloch, Minion, SafeMinion } from "../generated/schema";
import { addTransaction } from "./transactions";

function setupMinion(event: SummonMinion, version: string): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  let minionAddress = event.params.minion;

  let minionId = molochId.concat("-minion-").concat(minionAddress.toHex());
  let minion = new Minion(minionId);

  log.info("**** summoned safeminion: {}, moloch: {}", [minionId, molochId]);

  let details = event.params.details;
  if (details.startsWith("0xab270234") || details.startsWith("0xfc3b5b76")) {
    // bytes4(keccak256(abi.encodePacked('AMBMinionSafe'))) === 0xab270234
    // bytes4(keccak256(abi.encodePacked("NomadMinionSafe"))) === 0xfc3b5b76
    let fields = details.split("/");
    minion.bridgeModule =
      fields[0] == "0xab270234" ? "AMBModule" : "NomadModule";
    minion.details = fields[1];
    minion.crossChainMinion = true;
    minion.foreignChainId = fields[2];
    minion.foreignSafeAddress = Bytes.fromHexString(fields[3]) as Bytes;
  } else {
    minion.details = details;
    minion.crossChainMinion = false;
  }

  minion.minionAddress = minionAddress;
  minion.safeAddress = event.params.avatar;
  minion.safeMinionVersion = version;
  minion.molochAddress = event.params.moloch;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "3";
  minion.minQuorum = event.params.minQuorum;

  minion.save();

  let safeMinion = SafeMinion.load(event.params.avatar.toHex());
  if (safeMinion == null) {
    safeMinion = new SafeMinion(event.params.avatar.toHex());
    safeMinion.minions = [minionId];
  } else {
    let currMinions = safeMinion.minions;
    currMinions.push(minionId);
    safeMinion.minions = currMinions;
  }

  safeMinion.save();

  addTransaction(event.block, event.transaction);
}

export function handleSummonedSafeMinion(event: SummonMinion): void {
  SafeMinionTemplate.create(event.params.minion);
  setupMinion(event, "1");
}

export function handleSummonedSafeMinionV2(event: SummonMinion): void {
  SafeMinionTemplate.create(event.params.minion);
  setupMinion(event, "2");
}
