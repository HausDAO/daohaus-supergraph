export class LegacyDaoData {
  constructor(public address: string, public title: string) {}
}

export function legacyV1(): LegacyDaoData[] {
  return [
    new LegacyDaoData(
      "0x0372f3696fa7dc99801f435fd6737e57818239f2",
      "Moloch DAO"
    ),
    new LegacyDaoData(
      "0x0372f3696fa7dc99801f435fd6737e57818239f2",
      "MetaCartel DAO"
    ),
  ];
}

export function legacyV2(): LegacyDaoData[] {
  return [
    new LegacyDaoData(
      "0x4570b4faf71e23942b8b9f934b47ccedf7540162",
      "MetaCartel Ventures"
    ),
    new LegacyDaoData("0x8f56682a50becb1df2fb8136954f2062871bc7fc", "The LAO"),
  ];
}
