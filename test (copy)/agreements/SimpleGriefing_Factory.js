// require artifacts
const SimpleGriefing_FactoryArtifact = require("../../build/SimpleGriefing_Factory.json");
const SimpleGriefingArtifact = require("../../build/SimpleGriefing.json");
const MockNMRArtifact = require("../../build/MockNMR.json");
const ErasureAgreementsRegistryArtifact = require("../../build/Erasure_Agreements.json");
const ErasurePostsRegistryArtifact = require("../../build/Erasure_Posts.json");

// test helpers
const { createDeployer, initDeployment } = require("../helpers/setup");
const testFactory = require("../modules/Factory");
const { RATIO_TYPES } = require("../helpers/variables");

const env = require("@nomiclabs/buidler");
const { utils } = require("ethers");

// variables used in initialize()
const factoryName = "SimpleGriefing_Factory";
const instanceType = "Agreement";
const ratio = utils.parseEther("2");
const ratioType = RATIO_TYPES.Dec;
const staticMetadata = "TESTING";

const createTypes = [
  "address",
  "address",
  "address",
  "uint256",
  "uint8",
  "bytes"
];

let SimpleGriefing;
let deployer, MockNMR;

describe.skip(factoryName, () => {
  before(async () => {
    [deployer, MockNMR] = await initDeployment();
    SimpleGriefing = await deployer.deploy(SimpleGriefingArtifact);
  });
  it("setups test", async () => {
    const [operator, staker, counterparty] = await env.ethers.signers();
    const createArgs = [
      await operator.getAddress(),
      await staker.getAddress(),
      await counterparty.getAddress(),
      ratio,
      ratioType,
      Buffer.from(staticMetadata)
    ];

    testFactory(
      deployer,
      "SimpleGriefing_Factory",
      instanceType,
      createTypes,
      createArgs,
      SimpleGriefing_FactoryArtifact,
      ErasureAgreementsRegistryArtifact,
      ErasurePostsRegistryArtifact,
      [SimpleGriefing.contractAddress]
    );
  });
});
