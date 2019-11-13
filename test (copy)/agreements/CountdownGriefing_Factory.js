const ethers = require("ethers");
const env = require("@nomiclabs/buidler");
const { utils } = require("ethers");
// require artifacts
const CountdownGriefingArtifact = require("../../build/CountdownGriefing.json");
const CountdownGriefing_FactoryArtifact = require("../../build/CountdownGriefing_Factory.json");
const MockNMRArtifact = require("../../build/MockNMR.json");
const ErasureAgreementsRegistryArtifact = require("../../build/Erasure_Agreements.json");
const ErasurePostsRegistryArtifact = require("../../build/Erasure_Posts.json");

// test helpers
const { initDeployment } = require("../helpers/setup");
const testFactory = require("../modules/Factory");
const { RATIO_TYPES } = require("../helpers/variables");

// variables used in initialize()
const factoryName = "CountdownGriefing_Factory";
const instanceType = "Agreement";

const ratio = utils.parseEther("2");
const ratioType = RATIO_TYPES.Dec;
const countdownLength = 1000;
const staticMetadata = "TESTING";

const createTypes = [
  "address",
  "address",
  "address",
  "uint256",
  "uint8",
  "uint256",
  "bytes"
];

let CountdownGriefing;
let deployer, MockNMR;

// const [ownerWallet, stakerWallet, counterpartyWallet] = accounts;
// const owner = ownerWallet.signer.signingKey.address;
// const staker = stakerWallet.signer.signingKey.address;
// const counterparty = counterpartyWallet.signer.signingKey.address;
describe.skip("CountdownGriefing_Factory", () => {
  before(async () => {
    // console.log("beeeep")[(deployer, MockNMR)] = await initDeployment();
    // CountdownGriefing = await deployer.deploy(CountdownGriefingArtifact);
  });

  it("setups test", async () => {
    const [owner, staker, counterparty] = await env.ethers.signers();

    const createArgs = [
      await owner.getAddress(),
      await staker.getAddress(),
      await counterparty.getAddress(),
      ratio,
      ratioType,
      countdownLength,
      Buffer.from(staticMetadata)
    ];

    testFactory(
      deployer,
      factoryName,
      instanceType,
      createTypes,
      createArgs,
      CountdownGriefing_FactoryArtifact,
      ErasureAgreementsRegistryArtifact,
      ErasurePostsRegistryArtifact,
      [CountdownGriefing.contractAddress]
    );
  });
});
