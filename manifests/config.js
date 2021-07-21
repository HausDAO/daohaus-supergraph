module.exports.config = {
  mainnet: {
    dataSources: [
      {
        name: "v1Factory",
        template: "v1Factory-ds.yaml",
        address: "0x2840d12d926cc686217bb42b80b662c7d72ee787",
        startBlock: 8625240,
      },
      {
        name: "v2Factory",
        template: "v2Factory-ds.yaml",
        address: "0x1782a13f176e84Be200842Ade79daAA0B09F0418",
        startBlock: 9484660,
      },
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x38064F40B20347d58b326E767791A6f79cdEddCe",
        startBlock: 11499150,
      },
      {
        name: "minionFactory",
        template: "minionFactory-ds.yaml",
        address: "0x2A0D29d0a9e5DE91512805c3E2B58c1e95700dDa",
        startBlock: 11499121,
      },
      {
        name: "v2minionFactory",
        template: "v2MinionFactory-ds.yaml",
        address: "0x88207Daf515e0da1A32399b3f92D128B1BF45294",
        startBlock: 12227886,
      },
      {
        name: "molochDao",
        template: "molochDao-ds.yaml",
        address: "0x1fd169a4f5c59acf79d0fd5d91d1201ef1bce9f1",
        startBlock: 7218560,
      },
    ],
    templates: [
      {
        name: "v1Template",
        template: "v1-template.yaml",
      },
      {
        name: "v2Template",
        template: "v2-template.yaml",
      },
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
    ],
  },
  xdai: {
    dataSources: [
      {
        name: "v1Factory",
        template: "v1Factory-ds.yaml",
        address: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
        startBlock: 10733005,
      },
      {
        name: "v2Factory",
        template: "v2Factory-ds.yaml",
        address: "0x124F707B3675b5fdd6208F4483C5B6a0B9bAf316",
        startBlock: 10733005,
      },
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x0F50B2F3165db96614fbB6E4262716acc9F9e098",
        startBlock: 13569775,
      },
      {
        name: "minionFactory",
        template: "minionFactory-ds.yaml",
        address: "0x9610389d548Ca0224aCaC40eB3241c5ED88D2479",
        startBlock: 13569739,
      },
      {
        name: "v2minionFactory",
        template: "v2MinionFactory-ds.yaml",
        address: "0x53508D981439Ce6A3283597a4775F6f23504d4A2",
        startBlock: 15503980,
      },
      {
        name: "uberMinionFactory",
        template: "uberMinionFactory-ds.yaml",
        address: "0xf5106077892992B84c33C35CA8763895eb80B298",
        startBlock: 14958440,
      },
      {
        name: "superfluidMinionFactory",
        template: "superfluidMinionFactory-ds.yaml",
        address: "0xfC86DfDd3b2e560729c78b51dF200384cfe87438",
        startBlock: 15925433,
      },
      {
        name: "niftyMinionFactory",
        template: "niftyMinionFactory-ds.yaml",
        address: "0xA6B75C3EBfA5a5F801F634812ABCb6Fd7055fd6d",
        startBlock: 16507968,
      },
    ],
    templates: [
      {
        name: "v1Template",
        template: "v1-template.yaml",
      },
      {
        name: "v2Template",
        template: "v2-template.yaml",
      },
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "uberHausMininTemplate",
        template: "uberhausMinion-template.yaml",
      },
      {
        name: "superfluidMinionTemplate",
        template: "superfluidMinion-template.yaml",
      },
    ],
  },
  matic: {
    dataSources: [
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x6690C139564144b27ebABA71F9126611a23A31C9",
        startBlock: 10397177,
      },
      {
        name: "minionFactory",
        template: "minionFactory-ds.yaml",
        address: "0x52A67B01f029ED2EfEa7E17Dbb56397a612bf245",
        startBlock: 11318410,
      },
      {
        name: "v2minionFactory",
        template: "v2MinionFactory-ds.yaml",
        address: "0x02e458B5eEF8f23e78AefaC0F15f5d294C3762e9",
        startBlock: 13198765,
      },
      {
        name: "superfluidMinionFactory",
        template: "superfluidMinionFactory-ds.yaml",
        address: "0x52acf023d38A31f7e7bC92cCe5E68d36cC9752d6",
        startBlock: 14193470,
      },
      {
        name: "niftyMinionFactory",
        template: "niftyMinionFactory-ds.yaml",
        address: "0x4CCaDF3f5734436B28869c27A11B6D0F4776bc8E",
        startBlock: 15599778,
      },
    ],
    templates: [
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "superfluidMinionTemplate",
        template: "superfluidMinion-template.yaml",
      },
    ],
  },
  kovan: {
    dataSources: [
      {
        name: "v1Factory",
        template: "v1Factory-ds.yaml",
        address: "0x0C60Cd59f42093c7489BA68BAA4d7A01f2468153",
        startBlock: 14980875,
      },
      {
        name: "v2Factory",
        template: "v2Factory-ds.yaml",
        address: "0xB47778d3BcCBf5e39dEC075CA5F185fc20567b1e",
        startBlock: 16845360,
      },
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5",
        startBlock: 22640938,
      },
      {
        name: "minionFactory",
        template: "minionFactory-ds.yaml",
        address: "0x80ec2dB292E7a6D1D5bECB80e6479b2bE048AC98",
        startBlock: 22640617,
      },
      {
        name: "v2minionFactory",
        template: "v2MinionFactory-ds.yaml",
        address: "0xCE63803E265617c55567a7A7b584fF2dbD76210B",
        startBlock: 24234494,
      },
      {
        name: "uberMinionFactory",
        template: "uberMinionFactory-ds.yaml",
        address: "0x03042577463E3820F9cA6Ca3906BAad599ba9382",
        startBlock: 23861045,
      },
    ],
    templates: [
      {
        name: "v1Template",
        template: "v1-template.yaml",
      },
      {
        name: "v2Template",
        template: "v2-template.yaml",
      },
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "uberHausMininTemplate",
        template: "uberhausMinion-template.yaml",
      },
    ],
  },
  rinkeby: {
    dataSources: [
      {
        name: "v1Factory",
        template: "v1Factory-ds.yaml",
        address: "0x610247467d0dfA8B477ad7Dd1644e86CB2a79F8F",
        startBlock: 6494343,
      },
      {
        name: "v2Factory",
        template: "v2Factory-ds.yaml",
        address: "0x763b61A62EF076ad960E1d513713B2aeD7C1b88e",
        startBlock: 6494329,
      },
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0xC33a4EfecB11D2cAD8E7d8d2a6b5E7FEacCC521d",
        startBlock: 7771115,
      },
      {
        name: "minionFactory",
        template: "minionFactory-ds.yaml",
        address: "0x316eFCd421b0654B7aE8E806880D4AE88ecaE206",
        startBlock: 7737496,
      },
      {
        name: "v2minionFactory",
        template: "v2MinionFactory-ds.yaml",
        address: "0x313F02A44089150C9ff7011D4e87b52404A914A9",
        startBlock: 8402027,
      },
      {
        name: "superfluidMinionFactory",
        template: "superfluidMinionFactory-ds.yaml",
        address: "0x4b168c1a1E729F4c8e3ae81d09F02d350fc905ca",
        startBlock: 8541482,
      },
    ],
    templates: [
      {
        name: "v1Template",
        template: "v1-template.yaml",
      },
      {
        name: "v2Template",
        template: "v2-template.yaml",
      },
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "superfluidMinionTemplate",
        template: "superfluidMinion-template.yaml",
      },
    ],
  },
};
