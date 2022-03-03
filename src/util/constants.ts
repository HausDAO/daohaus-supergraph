import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export namespace constants {
  export let BIGINT_ZERO = BigInt.fromI32(0);
  export let BIGINT_ONE = BigInt.fromI32(1);
  export let BIGDECIMAL_ZERO = new BigDecimal(constants.BIGINT_ZERO);
  export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  export const BYTES32_ZERO =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  // daohaus.document.minion
  export const DAOHAUS_DOCUMENT_MINION =
    "0xb8914483df978adf1e0c56d779b486d84b246bf191ee217e7e04585aa202b9cb";
  // daohaus.document.member
  export const DAOHAUS_DOCUMENT_MEMBER =
    "0xfb49a9ea2a00dc3bbd1a1564686946d45e9cb59dbfa6424024b100a00982041e";
}
