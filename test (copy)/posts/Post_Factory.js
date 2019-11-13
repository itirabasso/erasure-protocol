const env = require("@nomiclabs/buidler");
const ethers = require("ethers");
// require artifacts
const PostFactoryArtifact = require("../../build/Post_Factory.json");
const PostArtifact = require("../../build/Post.json");
const ErasureAgreementsRegistryArtifact = require("../../build/Erasure_Agreements.json");
const ErasurePostsRegistryArtifact = require("../../build/Erasure_Posts.json");

// test helpers
const { createDeployer } = require("../helpers/setup");
const { createMultihashSha256 } = require("../helpers/utils");
const testFactory = require("../modules/Factory");

// variables used in initialize()
const factoryName = "Post_Factory";
const instanceType = "Post";
const proofHash = createMultihashSha256("proofHash");
const staticMetadata = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("staticMetadata")
);
const variableMetadata = ethers.utils.keccak256(
  ethers.utils.toUtf8Bytes("variableMetadata")
);

let PostTemplate;
let deployer;

// const deployer = createDeployer();

describe.skip(factoryName, async () => {
  const [, , creator] = await env.ethers.signers();
  const createTypes = ["address", "bytes", "bytes"];
  const createArgs = [await creator.getAddress(), proofHash, staticMetadata];

  before(async () => {
    deployer = createDeployer();
    PostTemplate = await deployer.deploy(PostArtifact);
  });
  it("setups test", () => {
    testFactory(
      deployer,
      factoryName,
      instanceType,
      createTypes,
      createArgs,
      PostFactoryArtifact,
      ErasurePostsRegistryArtifact,
      ErasureAgreementsRegistryArtifact,
      [PostTemplate.contractAddress]
    );
  });
});
