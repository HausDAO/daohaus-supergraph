import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

export namespace constants {
  export let BIGINT_ZERO = BigInt.fromI32(0);
  export let BIGINT_ONE = BigInt.fromI32(1);
  export let BIGDECIMAL_ZERO = new BigDecimal(constants.BIGINT_ZERO);
  export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  export const BYTES32_ZERO =
    "0x0000000000000000000000000000000000000000000000000000000000000000";
  // keccack256("daohaus.document.minion")
  export const DAOHAUS_DOCUMENT_MINION =
    "0xb8914483df978adf1e0c56d779b486d84b246bf191ee217e7e04585aa202b9cb";
  // keccack256("daohaus.document.member")
  export const DAOHAUS_DOCUMENT_MEMBER =
    "0xfb49a9ea2a00dc3bbd1a1564686946d45e9cb59dbfa6424024b100a00982041e";
  // keccack256("daohaus.member.customTheme")
  export const DAOHAUS_MEMBER_CUSTOMTHEME =
    "0xb93c4766ef624db783979c787d31e43c0f80dc611a097713e36d258339811b4c";
  // keccack256("daohaus.member.proposalConfig")
  export const DAOHAUS_MEMBER_PROPOSALCONFIG =
    "950672f69a9b65591ef07e7269539b942de043ea789bd9327ab49adfeb120059";
  // keccack256("daohaus.member.boosts")
  export const DAOHAUS_MEMBER_BOOSTS =
    "361cf6a265344268250b488cd1b81912870ce5dcc31208af44d55f593004b962";
  // keccack256("daohaus.member.daoProfile")
  export const DAOHAUS_MEMBER_DAOPROFILE =
    "f10ace9a912bb06d227e5280e46a1d4539d7aeb2c0aa1a304e56c86d73a825a1";
}
