import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { SummonMinion as SummonNiftyMinion  } from "../generated/NiftyMinionFactory/NiftyMinionFactory";
// import { NiftyMinionTemplate } from "../generated/templates";
import { handleSummonedMinion } from "./minion-factory-mapping";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedNiftyMinion(
  event: SummonNiftyMinion
): void {
    // NiftyMinionTemplate.create(event.params.minion);
  handleSummonedMinion(event as SummonMinion);
}
