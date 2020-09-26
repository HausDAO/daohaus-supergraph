import { Address } from "@graphprotocol/graph-ts";

import { SummonComplete } from "../generated/templates/MolochV1Template/V1Moloch";
import { MolochV1Template, MolochV2Template } from "../generated/templates";
import { handleSummonComplete } from "./v1-mapping";
import { legacyV1, legacyV2 } from "./legacy-data";
import { DaoMeta } from "../generated/schema";

export function handleSummonCompleteMoloch(event: SummonComplete): void {
  let v1Data = legacyV1();
  v1Data.forEach((dao) => {
    let daoAddress = Address.fromString(dao.address);
    MolochV1Template.create(daoAddress);

    let daoMeta = new DaoMeta(dao.address);
    daoMeta.title = dao.title;
    daoMeta.version = "1";
    daoMeta.newContract = "1";
    daoMeta.save();
  });

  let v2Data = legacyV2();
  v2Data.forEach((dao) => {
    let daoAddress = Address.fromString(dao.address);
    MolochV2Template.create(daoAddress);

    let daoMeta = new DaoMeta(dao.address);
    daoMeta.title = dao.title;
    daoMeta.version = "2";
    daoMeta.newContract = "1";
    daoMeta.save();
  });

  handleSummonComplete(event);
}
