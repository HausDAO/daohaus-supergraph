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
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0xf5add874c8c79b7fa8a86291549a4add50553e52",
        startBlock: 14062775,
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
      {
        name: "niftyMinionFactory",
        template: "niftyMinionFactory-ds.yaml",
        address: "0x7EDfBDED3077Bc035eFcEA1835359736Fa342209",
        startBlock: 13016332,
      },
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xbC37509A283E2bb67fd151c34E72e826C501E108",
        startBlock: 13199717,
      },
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xc9f9E7FC92A7D3B2b3554be850fFF462B7b382E7",
        startBlock: 13489283,
      },
      {
        name: "poster",
        template: "poster-ds.yaml",
        address: "0x000000000000cd17345801aa8147b8D3950260FF",
        startBlock: 14573288,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x594AF060c08EeA9f559Bc668484E50596BcB2CFB",
        startBlock: 14932271,
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
        name: "v22Template",
        template: "v22-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
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
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0x56fAA6aDcf15C5033f9b576426543522e5FD3e59",
        startBlock: 19988087,
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
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xA1b97D22e22507498B350A9edeA85c44bA7DBC01",
        startBlock: 18025529,
      },
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xc9f9E7FC92A7D3B2b3554be850fFF462B7b382E7",
        startBlock: 18589768,
      },
      {
        name: "poster",
        template: "poster-ds.yaml",
        address: "0x000000000000cd17345801aa8147b8d3950260ff",
        startBlock: 20936410,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0xBD090EF169c0C8589Acb33406C29C20d22bb4a55",
        startBlock: 22521240,
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
        name: "v22Template",
        template: "v22-template.yaml",
      },
      {
        name: "uberHausMininTemplate",
        template: "uberhausMinion-template.yaml",
      },
      {
        name: "superfluidMinionTemplate",
        template: "superfluidMinion-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
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
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xA1b97D22e22507498B350A9edeA85c44bA7DBC01",
        startBlock: 18962956,
      },
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xc9f9E7FC92A7D3B2b3554be850fFF462B7b382E7",
        startBlock: 20255100,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x594AF060c08EeA9f559Bc668484E50596BcB2CFB",
        startBlock: 29282563,
      },
      // {
      //   name: "poster",
      //   template: "poster-ds.yaml",
      //   address: "0x000000000000cd17345801aa8147b8D3950260FF",
      //   startBlock: 20904275,
      // },
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
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
      },
    ],
  },
  "arbitrum-one": {
    dataSources: [
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
        startBlock: 219866,
      },
      {
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0x3840453a3907916113dB88bFAc2349533a736c64",
        startBlock: 14012626,
      },
      {
        name: "niftyMinionFactory",
        template: "niftyMinionFactory-ds.yaml",
        address: "0xA92CbC525EabFa5baE4e0ff7bDa8E011B43B9aCC",
        startBlock: 361572,
      },
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xa1b97d22e22507498b350a9edea85c44ba7dbc01",
        startBlock: 1999034,
      },
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xc9f9E7FC92A7D3B2b3554be850fFF462B7b382E7",
        startBlock: 2258277,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x51498dDdd2A8cdeC82932E08A37eBaF346C38EFd",
        startBlock: 14004160,
      },
      // {
      //   name: "poster",
      //   template: "poster-ds.yaml",
      //   address: "0x000000000000cd17345801aa8147b8D3950260FF",
      //   startBlock: 20904275,
      // },
    ],
    templates: [
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "v22Template",
        template: "v22-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
      },
    ],
  },
  celo: {
    dataSources: [
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x8c47bD2ABae16323054a19aA562efC87A6c26d29",
        startBlock: 8691191,
      },
      {
        name: "niftyMinionFactory",
        template: "niftyMinionFactory-ds.yaml",
        address: "0xaD791Ef059A25b6C82e56977C6489974333C5A0C",
        startBlock: 8691275,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x51498dDdd2A8cdeC82932E08A37eBaF346C38EFd",
        startBlock: 13424760,
      },
    ],
    templates: [
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
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
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xA1b97D22e22507498B350A9edeA85c44bA7DBC01",
        startBlock: 27138866,
      },
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xc9f9E7FC92A7D3B2b3554be850fFF462B7b382E7",
        startBlock: 27734158,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x98B550caBec2602eE2c2259179d1A935777Ff257",
        startBlock: 32055269,
      },
      // {
      //   name: "poster",
      //   template: "poster-ds.yaml",
      //   address: "0x000000000000cd17345801aa8147b8D3950260FF",
      //   startBlock: 20904275,
      // },
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
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
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
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0xa24012Bcfc53b3C5c448726d99B68044cdADD77A",
        startBlock: 9901589,
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
      {
        name: "escrowMinion",
        template: "escrowMinion-ds.yaml",
        address: "0xEB28321b7952CC34bFb734413b58496A889C9660",
        startBlock: 9471294,
      },
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0x3f13ABc8931c0e381Ce6d1Be9f978aE6E9d99Cb8",
        startBlock: 9269583,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x4916aC39D4835aB7C21B93F332eCD56021942329",
        startBlock: 10789134,
      },
      {
        name: "poster",
        template: "poster-ds.yaml",
        address: "0x917d84787A266F9D649d519A7Ec8445eA43514D8",
        startBlock: 10226613,
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
        name: "v22Template",
        template: "v22-template.yaml",
      },
      {
        name: "superfluidMinionTemplate",
        template: "superfluidMinion-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "minionTemplate",
        template: "minion-template.yaml",
      },
    ],
  },
  goerli: {
    dataSources: [
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x72B8Bf40C8B316753a3E470689DA625759D2b025",
        startBlock: 7103207,
      },
      {
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0xA8680d0E43aDe8BC32eCCF6C446eCe4CA15d4258",
        startBlock: 7104213,
      },
      // {
      //   name: "escrowMinion",
      //   template: "escrowMinion-ds.yaml",
      //   address: "",
      //   startBlock: 1,
      // },
      {
        name: "poster",
        template: "poster-ds.yaml",
        address: "0x3c1f4802be7e26d95b31ef7a566e18f42e360cab",
        startBlock: 7103940,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x121931c0Bc458A5f13F3861444AeB036cc8a5363",
        startBlock: 7021834,
      },
    ],
    templates: [
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "v22Template",
        template: "v22-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
    ],
  },
  optimism: {
    dataSources: [
      {
        name: "v21Factory",
        template: "v21Factory-ds.yaml",
        address: "0x032865ACfc05E769902Fe90Bcc9d511875a74E66",
        startBlock: 4864699,
      },
      {
        name: "safeMinion",
        template: "safeMinionFactory-ds.yaml",
        address: "0xE01F3F0F09E778e1AD83Fbdaa00e86676F317C6e",
        startBlock: 4865989,
      },
      {
        name: "v2safeMinion",
        template: "v2safeMinionFactory-ds.yaml",
        address: "0x8C0463EAfc0B91d7A246CA391Dc4f81E9E6Bd029",
        startBlock: 10872276,
      },
      {
        name: "v22Factory",
        template: "v22Factory-ds.yaml",
        address: "0x9425f47e808d9d4fE56f5F9f517CbBDd802DcdFb",
        startBlock: 10877151,
      },
    ],
    templates: [
      {
        name: "v21Template",
        template: "v21-template.yaml",
      },
      {
        name: "safeMinionTemplate",
        template: "safeMinion-template.yaml",
      },
      {
        name: "v22Template",
        template: "v22-template.yaml",
      },
    ],
  },
};
