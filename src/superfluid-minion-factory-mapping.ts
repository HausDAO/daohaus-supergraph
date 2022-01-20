import { SummonMinion as SummonSuperfluidMinion } from "../generated/SuperfluidMinionFactory/SuperfluidMinionFactory";
import { SuperfluidMinionTemplate } from "../generated/templates";
import { Moloch, Minion } from "../generated/schema";
import { addTransaction } from "./transactions";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedSuperfluidMinion(
  event: SummonSuperfluidMinion
): void {
  SuperfluidMinionTemplate.create(event.params.minion);

  let molochId = event.params.moloch.toHexString();
  let moloch = Moloch.load(molochId);
  if (moloch == null) {
    return;
  }

  let minionId = molochId
    .concat("-minion-")
    .concat(event.params.minion.toHex());
  let minion = new Minion(minionId);

  minion.minionAddress = event.params.minion;
  minion.molochAddress = event.params.moloch;
  minion.crossChainMinion = false;
  minion.details = event.params.details;
  minion.minionType = event.params.minionType;
  minion.moloch = moloch.id;
  minion.createdAt = event.block.timestamp.toString();
  minion.version = "1";

  minion.save();

  addTransaction(event.block, event.transaction);
}
