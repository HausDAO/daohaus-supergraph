import { SummonMinion } from "../generated/MinionFactory/MinionFactory";
import { SummonMinion as SummonSuperfluidMinion } from "../generated/SuperfluidMinionFactory/SuperfluidMinionFactory";
import { SuperfluidMinionTemplate } from "../generated/templates";
import { handleSummonedMinion } from "./minion-factory-mapping";

// event SummonMinion(address indexed minion, address indexed moloch, string details, string minionType);
export function handleSummonedSuperfluidMinion(
  event: SummonSuperfluidMinion
): void {
  SuperfluidMinionTemplate.create(event.params.minion);
  handleSummonedMinion(event as SummonMinion);
}
