import { Address } from "@graphprotocol/graph-ts";

import { SummonComplete } from "../generated/templates/MolochV1Template/V1Moloch";
import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { handleSummonComplete } from "./v1-mapping";
import { legacyV1, legacyV2 } from "./legacy-data";

export function handleSummonCompleteMoloch(event: SummonComplete): void {
  let v1Data = legacyV1();
  v1Data.forEach((daoAddress) => {
    MolochV1Template.create(Address.fromString(daoAddress));
  });

  let v2Data = legacyV2();
  v2Data.forEach((daoAddress) => {
    MolochV2Template.create(Address.fromString(daoAddress));
  });

  handleSummonComplete(event);
}
