// const etherlime = require("etherlime-lib");
// const env = require("@nomiclabs/buidler");
const { utils } = require("ethers");
// const assert = require("assert")
const assertRevert = require('../helpers/assertRevert');
// assert.revertWith = ()

const { createDeployer } = require("../helpers/setup");
const {
  hexlify,
  createMultihashSha256,
  abiEncodeWithSelector,
  assertEvent
} = require("../helpers/utils");

// artifacts
const TestFeedArtifact = require("../../build/Feed.json");
// const FeedFactoryArtifact = require("../../build/Feed_Factory.json");
// const ErasurePostsArtifact = require("../../build/Erasure_Posts.json");
console.log("se carga");
let deployer;
let creatorSig, otherSig, operatorSig;
let creatorAddress, otherAddress, operatorAddress;
describe("Feed", async () => {
  // const creator = await creatorSig.getAddress();
  // const other = await otherSig.getAddress();
  // const operator = await operatorSig.getAddress();

  // local Post array
  let posts = [];
  const addPost = (proofHash, metadata) => {
    const postID = posts.push({ proofHash, metadata }) - 1;
    return postID;
  };

  // post variables
  const feedMetadata = utils.keccak256(utils.toUtf8Bytes("feedMetadata"));
  const newFeedMetadata = utils.keccak256(utils.toUtf8Bytes("newFeedMetadata"));
  const proofHash = createMultihashSha256("proofHash");
  const hash = utils.keccak256(hexlify("proofHash"));
  const invalidProofHash = utils.keccak256(hexlify("invalidProofHash"));
  const postMetadata = utils.keccak256(utils.toUtf8Bytes("postMetadata"));



  const deployDeactivatedFeed = async () => {
    const feed = await deployTestFeed();
    await feed.from(operator).renounceOperator();
    return feed;
  };

  before(async () => {
    // wallets and addresses
    const signers = await ethers.signers();
    [creator, other, operator] = signers;
    // creatorSig = signers[0];
    // otherSig = signers[1];
    // operatorSig = signers[2];

    creatorAddress = await creator.getAddress();
    otherAddress = await other.getAddress();
    operatorAddress = await operator.getAddress();

    deployer = await createDeployer();

    // this.PostRegistry = await deployer.deploy(ErasurePostsArtifact);

    // this.FeedTemplate = await deployer.deploy(TestFeedArtifact);

    // this.FeedFactory = await deployer.deploy(
    //   FeedFactoryArtifact,
    //   false,
    //   this.PostRegistry.contractAddress,
    //   this.FeedTemplate.contractAddress
    // );

    // await this.PostRegistry.from(deployer.signer).addFactory(
    //   this.FeedFactory.contractAddress,
    //   "0x"
    // );
    // this.DeactivatedFeed = await deployDeactivatedFeed();
  });

  const deployTestFeed = async (
    validInit = true,
    args = [operatorAddress, proofHash, feedMetadata]
  ) => {
    let callData;
    const params = validInit ? ["address", "bytes", "bytes"] : ["bytes"];
    const values = validInit ? args : [feedMetadata];
    const postID = addPost(proofHash);
    
    if (validInit) {
      const c  = await erasure.createInstance("Feed_Factory", "Feed", params, values);
      return await c.deployed()
    } else {
      assert.equal(1, 2);
    }
    // return feed;

    // const feedFactory =  erasure.getDeployedContracts('Feed_Factory');
    // // const txn = await this.FeedFactory.from(creator).create(callData);
    // const txn = await feedFactory.from(creator).create(callData);
    // const receipt = await this.FeedFactory.verboseWaitForTransaction(txn);
    // const expectedEvent = "InstanceCreated";
    // const createFeedEvent = receipt.events.find(
    //   emittedEvent => emittedEvent.event === expectedEvent,
    //   "There is no such event"
    // );
    // // parse event logs to get new instance address
    // // use new instance address to create contract object
    // const feedAddress = createFeedEvent.args.instance;
    // if (!validInit) {
    //   assert.equal(feedAddress, undefined);
    // } else {
    //   const feedContract = deployer.wrapDeployedContract(
    //     TestFeedArtifact,
    //     feedAddress
    //   );
    //   return feedContract;
    // }
  };

  describe("Feed.initialize", () => {
    it.skip("should revert when initialize with malformed init data", async () => {
      assert.throws(await deployTestFeed(false))
      // await assert.revert(deployTestFeed(false));

    });

    it("should initialize feed", async () => {
      const testFeed = await deployTestFeed(true);

      // Operator._setOperator
      const actualOperator = await testFeed.getOperator();
      assert.equal(actualOperator, operator._address);

      //  Operator._activateOperator()
      const operatorIsActive = await testFeed.hasActiveOperator();
      assert.equal(operatorIsActive, true);
    });
  });

  describe("Feed.submitHash", () => {
    // check operator access control
    it("should revert when msg.sender is not operator or creator", async () => {
      const testFeed = await deployTestFeed(true);

      // Factory has to be the sender here
      const connected = await testFeed.from(other);
      // console.log('feed', connected)
      await assert.revert(connected.submitHash(hash))
      // await assertRevert(connected.submitHash(hash));
      // try{
      //   await connected.submitHash(hash)
      // }catch(err) {
      //   console.log('errrrr', typeof(err), Object.keys(err), err);
      // }

    });

    // check deactivated operator
    it("should revert when msg.sender is operator but not active", async () => {
      const deactivatedFeed = await deployDeactivatedFeed();

      await assert.revertWith(
         deactivatedFeed.from(operator).submitHash(hash),
        "only active operator or creator"
      );
    });

    // success case
    it("should submit hash successfully from creator", async () => {
      const testFeed = await deployTestFeed(true);

      const hash = utils.keccak256(hexlify("proofHash1"));
      const postID = addPost(hash);


      const txn = await testFeed.from(creator).submitHash(hash);
      await assertEvent(testFeed, txn, "HashSubmitted", [hash]);
    });

    it("should submit hash successfully from operator", async () => {
      const testFeed = await deployTestFeed(true);
      const hash = utils.keccak256(hexlify("proofHash2"));
      const postID = addPost(hash);

      const txn = await testFeed.from(operator).submitHash(hash);
      await assertEvent(testFeed, txn, "HashSubmitted", [hash]);
    });
  });

  describe("Feed.setMetadata", () => {
    it("should revert when msg.sender not operator or creator", async () => {
      const testFeed = await deployTestFeed(true);
      await assert.revertWith(
        testFeed.from(other).setMetadata(newFeedMetadata),
        "only active operator or creator"
      );
    });

    it("should revert when msg.sender is operator but not active", async () => {
      const deactivatedFeed = await deployDeactivatedFeed();
      await assert.revertWith(
        deactivatedFeed.from(operator).setMetadata(newFeedMetadata),
        "only active operator or creator"
      );
    });

    it("should set feed metadata from operator when active", async () => {
      const testFeed = await deployTestFeed(true);
      const txn = await testFeed.from(operator).setMetadata(
        newFeedMetadata
      );
      await assert.emit(txn, "MetadataSet");
      await assert.emitWithArgs(txn, [newFeedMetadata]);
    });

    it("should set feed metadata from creator", async () => {
      const testFeed = await deployTestFeed(true);

      const txn = await testFeed.from(creator).setMetadata(
        newFeedMetadata
      );
      await assert.emit(txn, "MetadataSet");
      // console.log('newFeedMetadata', newFeedMetadata);
      await assert.emitWithArgs(txn, [newFeedMetadata]);
    });
  });
});
