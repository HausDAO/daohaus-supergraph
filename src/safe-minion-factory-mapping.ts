import { Bytes, log } from "@graphprotocol/graph-ts";
import { SummonMinion } from "../generated/SafeMinionFactory/SafeMinionFactory";
import { SafeMinionTemplate } from "../generated/templates";
import { Moloch, Minion } from "../generated/schema";
import { addTransaction } from "./transactions";

// event SummonMinion(address indexed minion, address indexed moloch, address indexed avatar, string details, string minionType, uint256 minQuorum);
export function handleSummonedSafeMinion(event: SummonMinion): void {
  SafeMinionTemplate.create(event.params.minion);

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
  if (details.startsWith("0xab270234")) { // bytes4(keccak256(abi.encodePacked('AMBMinionSafe'))) === 0xab270234
    let fields = details.split("/");
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
  minion.molochAddress = event.params.moloch;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "3";
  minion.minQuorum = event.params.minQuorum;

  minion.save();

  addTransaction(event.block, event.transaction);
}
