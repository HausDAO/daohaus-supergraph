import { log } from "@graphprotocol/graph-ts";
import { Moloch, Minion } from "../generated/schema";
import {
  SetUberHaus,
  UberhausMinion,
} from "../generated/templates/UberhausMinionTemplate/UberhausMinion";

export function handleSetUberHaus(event: SetUberHaus): void {
  let contract = UberhausMinion.bind(event.address);
  let result = contract.try_dao();
  if (result.reverted) {
    log.info(
      "^^^^^ handleSetUberHaus contract call reverted. event.params.uberHaus: {}",
      [event.params.uberHaus.toHexString()]
    );
    return;
  }
  let molochAddress = result.value;

  let minionId = molochAddress
    .toHexString()
    .concat("-minion-")
    .concat(event.address.toHex());
  let minion = new Minion(minionId);

  let uberHausId = event.params.uberHaus.toHexString();
  let uberHausMoloch = Moloch.load(uberHausId);
  log.info("&&&&& handleSetUberHaus minionId: {}, uberHausId: {}", [
    minionId,
    uberHausId,
  ]);

  if (uberHausMoloch !== null) {
    minion.uberHausAddress = event.params.uberHaus;
    minion.uberHaus = uberHausMoloch.id;
    minion.save();
  }
}
