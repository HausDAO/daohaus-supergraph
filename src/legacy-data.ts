export class LegacyDaoData {
  constructor(public address: string, public title: string) {}
}

export function legacyV1(): LegacyDaoData[] {
  return [
    new LegacyDaoData(
      "0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1",
      "Moloch DAO"
    ),
    new LegacyDaoData(
      "0x0372f3696fa7dc99801f435fd6737e57818239f2",
      "MetaCartel DAO"
    ),
    new LegacyDaoData(
      "0xcc7dcdb700eed457c8180406d7d699877f4eee24",
      "TrojanDAO"
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
