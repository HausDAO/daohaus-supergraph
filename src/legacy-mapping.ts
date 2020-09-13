import { Address } from "@graphprotocol/graph-ts";

import { SummonComplete } from "../generated/templates/MolochV1Template/V1Moloch";
import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { handleSummonComplete } from "./v1-mapping";
import { legacyV1, legacyV2 } from "./legacy-data";

export function handleSummonCompleteMoloch(event: SummonComplete): void {
  let v1Data = legacyV1();
  v1Data.forEach((dao) => {
    let daoAddress = Address.fromString(dao.getAddress());
    MolochV1Template.create(daoAddress);
  });

  let v2Data = legacyV2();
  v2Data.forEach((dao) => {
    let daoAddress = Address.fromString(dao.getAddress());
    MolochV2Template.create(daoAddress);
  });

  handleSummonComplete(event);
}
