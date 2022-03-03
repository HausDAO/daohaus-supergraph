import { Address, Bytes, log } from "@graphprotocol/graph-ts";
import { Minion } from "../../generated/Poster/Minion";
import { Moloch } from "../../generated/Poster/Moloch";
import { constants } from "./constants";

export namespace validator {
  export function isMolochMinion(
    molochAddress: string,
    senderAddress: Address | null
  ): boolean {
    if (senderAddress === null) {
      return false;
    }
    let address = changetype<Address>(senderAddress);
    let minionContract = Minion.bind(address);

    let result = minionContract.try_moloch();
    if (result.reverted) {
      log.info("^^^^^ minion call failed; {}", [molochAddress]);
      return false;
    }

    log.info("^^^^^ comparing; {} with {}", [
      result.value.toHexString(),
      molochAddress,
    ]);

    return result.value.toHexString() == molochAddress;
  }

  export function isMolochMember(
    molochAddress: string,
    senderAddress: Address
  ): boolean {
    // TODO: rework this to use mapping/member entity lookup
    let address = changetype<Address>(molochAddress);
    let molochContract = Moloch.bind(address);

    log.info("^^^^^ calling member; {}, moloch: {}", [
      senderAddress.toHexString(),
      molochAddress,
    ]);

    let result = molochContract.try_getCurrentPeriod();

    // let result = molochContract.try_members(senderAddress);
    if (result.reverted) {
      log.info("^^^^^ member call failed; {}", [senderAddress.toHexString()]);
      return false;
    }

    log.info("^^^^^ member call success; {}", [result.value.toString()]);

    return true;

    // log.info("^^^^^ member found 1; {}", []);
    // if (result.value.value1 !== null) {
    //   log.info("^^^^^ member found 2; {}", [result.value.value1.toString()]);

    //   return result.value.value1 > constants.BIGINT_ZERO;
    // } else {
    //   log.info("^^^^^ member not found; {}", []);

    //   return false;
    // }
  }
}
