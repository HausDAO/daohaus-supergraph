const fs = require("fs");
const yaml = require("js-yaml");

const config = {
  kovan: {
    v1FactoryAddress: "0x0C60Cd59f42093c7489BA68BAA4d7A01f2468153",
    v1FactoryStartBlock: 14980875,
    v2FactoryAddress: "0xB47778d3BcCBf5e39dEC075CA5F185fc20567b1e",
    v2FactoryStartBlock: 16845360,
    minionFactoryAddress: "0x80ec2dB292E7a6D1D5bECB80e6479b2bE048AC98",
    minionFactoryStartBlock: 22640617,
    v21FactoryAddress: "0x9c5d087f912e7187D9c75e90999b03FB31Ee17f5",
    v21FactoryStartBlock: 22640938,
  },
  rinkeby: {
    v1FactoryAddress: "0x610247467d0dfA8B477ad7Dd1644e86CB2a79F8F",
    v1FactoryStartBlock: 6494343,
    v2FactoryAddress: "0x763b61A62EF076ad960E1d513713B2aeD7C1b88e",
    v2FactoryStartBlock: 6494329,
    minionFactoryAddress: "0x316eFCd421b0654B7aE8E806880D4AE88ecaE206",
    minionFactoryStartBlock: 7737496,
    v21FactoryAddress: "0xC33a4EfecB11D2cAD8E7d8d2a6b5E7FEacCC521d",
    v21FactoryStartBlock: 7771115,
  },
  xdai: {
    v1FactoryAddress: "0x9232DeA84E91b49feF6b604EEA0455692FC27Ba8",
    v1FactoryStartBlock: 10733005,
    v2FactoryAddress: "0x124F707B3675b5fdd6208F4483C5B6a0B9bAf316",
    v2FactoryStartBlock: 10733005,
    minionFactoryAddress: "0x9610389d548Ca0224aCaC40eB3241c5ED88D2479",
    minionFactoryStartBlock: 13569739,
    v21FactoryAddress: "0x0F50B2F3165db96614fbB6E4262716acc9F9e098",
    v21FactoryStartBlock: 13569775,
  },
  mainnet: {
    v1FactoryAddress: "0x2840d12d926cc686217bb42b80b662c7d72ee787",
    v1FactoryStartBlock: 8625240,
    v2FactoryAddress: "0x1782a13f176e84Be200842Ade79daAA0B09F0418",
    v2FactoryStartBlock: 9484660,
    minionFactoryAddress: "0x2A0D29d0a9e5DE91512805c3E2B58c1e95700dDa",
    minionFactoryStartBlock: 11499121,
    v21FactoryAddress: "0x38064F40B20347d58b326E767791A6f79cdEddCe",
    v21FactoryStartBlock: 11499150,
  },
};

const network = process.argv.slice(2)[0];

try {
  let fileContents = fs.readFileSync("./subgraph-template.yaml", "utf8");
  let data = yaml.safeLoad(fileContents);

  data.dataSources[0].network = network;
  data.dataSources[0].source.address = config[network].v1FactoryAddress;
  data.dataSources[0].source.startBlock = config[network].v1FactoryStartBlock;

  data.dataSources[1].network = network;
  data.dataSources[1].source.address = config[network].v2FactoryAddress;
  data.dataSources[1].source.startBlock = config[network].v2FactoryStartBlock;

  data.dataSources[2].network = network;
  data.dataSources[2].source.address = config[network].v21FactoryAddress;
  data.dataSources[2].source.startBlock = config[network].v21FactoryStartBlock;

  data.dataSources[3].network = network;
  data.dataSources[3].source.address = config[network].minionFactoryAddress;
  data.dataSources[3].source.startBlock =
    config[network].minionFactoryStartBlock;

  data.templates[0].network = network;
  data.templates[1].network = network;
  data.templates[2].network = network;

  if (network !== "mainnet") {
    // remove molochDao mapping
    data.dataSources.splice(4, 1);
  }

  let yamlStr = yaml.safeDump(data);
  fs.writeFileSync("subgraph.yaml", yamlStr, "utf8");

  console.log("Generated subgraph.yaml for " + network);
} catch (e) {
  console.log(e);
}
