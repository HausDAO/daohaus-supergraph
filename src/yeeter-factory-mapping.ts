import { SummonYeetComplete } from "../generated/YeeterFactory/YeeterFactory";
import { Moloch, Shaman } from "../generated/schema";
import { addTransaction } from "./transactions";

// event SummonYeetComplete(
//     address indexed moloch,
//     address uhMoloch,
//     address wrapper,
//     uint256 maxTarget,
//     uint256 raiseEndTime,
//     uint256 raiseStartTime,
//     uint256 maxUnits,
//     uint256 pricePerUnit
// );
export function handleSummonYeeter(event: SummonYeetComplete): void {
  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  let shamanAddress = event.params.uhMoloch;
  let shamanId = molochId.concat("-shaman-").concat(shamanAddress.toHex());
  let shaman = new Shaman(shamanId);

  shaman.molochAddress = event.params.moloch;
  shaman.moloch = moloch.id;
  shaman.createdAt = event.block.timestamp.toString();
  shaman.shamanAddress = shamanAddress;
  shaman.shamanType = "yeeter";
  shaman.yeeterUhMoloch = event.params.uhMoloch;
  shaman.yeeterRaiseEndTime = event.params.raiseEndTime;
  shaman.yeeterRaiseStartTime = event.params.raiseStartTime;
  shaman.yeeterMaxUnits = event.params.maxUnits;
  shaman.yeeterMaxTarget = event.params.maxTarget;

  // shaman.details = event.params.details;
  shaman.details = "temp";

  shaman.save();

  addTransaction(event.block, event.transaction);
}
