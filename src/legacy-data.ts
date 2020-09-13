export class LegacyDaoData {
  constructor(public address: string) {}

  getAddress(): string {
    return this.address;
  }
}

export function legacyV1(): LegacyDaoData[] {
  return [
    // moloch dao
    new LegacyDaoData("0x0372f3696fa7dc99801f435fd6737e57818239f2"),
    // metacartel dao
    new LegacyDaoData("0x0372f3696fa7dc99801f435fd6737e57818239f2"),
  ];
}

export function legacyV2(): LegacyDaoData[] {
  return [
    // mcv
    new LegacyDaoData("0x4570b4faf71e23942b8b9f934b47ccedf7540162"),
    // the lao
    new LegacyDaoData("0x8f56682a50becb1df2fb8136954f2062871bc7fc"),
  ];
}
