const ethers = require("ethers");
const assert = require("assert");
// const ganache = require("ganache-cli");
const {
  hexlify,
  createMultihashSha256,
  abiEncodeWithSelector
} = require("./utils");

const { readArtifact } = require("@nomiclabs/buidler/plugins");

// TODO : why is this necessary? easier to mock?
let c = {
  NMR: {
    artifact: require("./artifacts/MockNMR.json")
  },
  Erasure_Agreements: {
    artifact: require("./artifacts/Erasure_Agreements.json")
  },
  Erasure_Posts: {
    artifact: require("./artifacts/Erasure_Posts.json")
  },
  SimpleGriefing: {
    factoryArtifact: require("./artifacts/SimpleGriefing_Factory.json"),
    templateArtifact: require("./artifacts/SimpleGriefing.json")
  },
  CountdownGriefing: {
    factoryArtifact: require("./artifacts/CountdownGriefing_Factory.json"),
    templateArtifact: require("./artifacts/CountdownGriefing.json")
  },
  Feed: {
    factoryArtifact: require("./artifacts/Feed_Factory.json"),
    templateArtifact: require("./artifacts/Feed.json")
  },
  Post: {
    factoryArtifact: require("./artifacts/Post_Factory.json"),
    templateArtifact: require("./artifacts/Post.json")
  }
};

// TODO : where should i use this mnemonic?
// let ganacheConfig = {
//   port: 8545,
//   unlocked_accounts: ["0x9608010323ed882a38ede9211d7691102b4f0ba0"],
//   default_balance_ether: 1000,
//   total_accounts: 10,
//   hardfork: "constantinople",
//   mnemonic:
//     "myth like bonus scare over problem client lizard pioneer submit female collect"
// };

// const server = ganache.server(ganacheConfig);
// server.listen("8545");

// const provider = new ethers.providers.JsonRpcProvider();
// const deployKey =
//   "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d";
const nmrDeployAddress = "0x9608010323ed882a38ede9211d7691102b4f0ba0";

// function getBalance(signer) {
//   // env.provider
//   // get balance from signer
// }
// async function transferAllBalance(from, to) {
//   const SEND_BALANCE_GAS_LIMIT = 21000;
//   const balance = getBalance(from);
//   const gasPrice = env.provider.getGasPrice();
//   const value = balance.sub(gasPrice.mul(SEND_BALANCE_GAS_LIMIT));
//   await signer.sendTransaction({
//     to,
//     value
//   });
// }

task("send-balance", async (args, env) => {
  // const defaultSigner = (await env.ethers.signers())[9];
  const { from, to } = args;
  // console.log(from, to)
  // const defaultSigner = (await env.ethers.signers())[0];
  const balance = await from.getBalance(from.address);
  const gasPrice = await env.ethers.provider.getGasPrice();
  // TODO : why doesn't work with 21000?
  const gasLimit = 21001;
  // console.log(balance.toString(), balance, gasPrice.toNumber(), balance.sub(gasPrice.mul(gasLimit)));
  const value = balance.sub(gasPrice.mul(gasLimit));
  // console.log('sending ether to nmr signer')
  // console.log(balance, gasPrice, {
  //   to: to._address,
  //   value
  // });
  // process.exit(33);
  await from.sendTransaction({
    to: to,
    value
  });
  // console.log('ether sent')
});

// const sendEthToNMRSigner = async () => {
//   // empty out the default signer's balance
//   // and send to nmr signer
//   const defaultSigner = provider.getSigner(9);
//   const balance = await defaultSigner.getBalance(defaultSigner.address);
//   const gasPrice = await provider.getGasPrice();
//   const gasLimit = 21000;
//   const value = balance.sub(gasPrice.mul(gasLimit));

//   await defaultSigner.sendTransaction({
//     to: nmrDeployAddress,
//     value
//   });
// };

// async function deployer(artifact, params, signer) {
//   const factory = new ethers.ContractFactory(
//     artifact.compilerOutput.abi,
//     artifact.compilerOutput.evm.bytecode.object,
//     signer
//   );
//   const contract = await factory.deploy(...params);
//   const receipt = await provider.getTransactionReceipt(
//     contract.deployTransaction.hash
//   );
//   return [contract, receipt];
// }

internalTask("deploy", async (args, env, runSuper) => {
  // update artifacts
  // await env.run("compile");

  const { name, params } = args;
  const factory = await env.ethers.getContract(name);
  const contract = await factory.deploy(...params);
  // await env.deployments.saveDeployedContract(name, instance);

  const receipt = await env.ethers.provider.getTransactionReceipt(
    contract.deployTransaction.hash
  );
  console.log("Deploy", contract.address, name, receipt.gasUsed.toString());
  return [contract, receipt];
});

task("deploy-contract", async (args, env, runSuper) => {
  // TODO : use the artifacts config
  // const name = contractName
  const { name, params, signer } = args;
  // const artifact = await readArtifact(env.config.paths.artifacts, name);
  const [contract, receipt] = await run("deploy", { name, params, signer });
  return [contract, receipt];
});

task("deploy-factory", async (args, env, runSuper) => {

  const { artifacts, registry, signer } = args;
  const { templateArtifact, factoryArtifact } = artifacts;

  const [template, _] = await run("deploy", {
    name: templateArtifact.contractName,
    params: [],
    signer: signer
  });

  const [factory, __] = await run("deploy", {
    name: factoryArtifact.contractName,
    params: [registry.address, template.address],
    signer
  });
  const tx = await registry.addFactory(factory.address, "0x");
  const receipt = await env.ethers.provider.getTransactionReceipt(tx.hash);
  console.log("addFactory", /*contractName,*/ receipt.gasUsed.toString());

  return [template, factory];
});

task("deploy-factories", async (args, { run }, runSuper) => {
  console.log("Deploy Factories");

  const { deployer } = args;

  [c.SimpleGriefing.template, c.SimpleGriefing.factory] = await run(
    "deploy-factory",
    {
      artifacts: c.SimpleGriefing,
      registry: c.Erasure_Agreements.registry,
      signer: deployer
    }
  );

  [c.CountdownGriefing.template, c.CountdownGriefing.factory] = await run(
    "deploy-factory",
    {
      artifacts: c.CountdownGriefing,
      registry: c.Erasure_Agreements.registry,
      signer: deployer
    }
  );

  [c.Post.template, c.Post.factory] = await run("deploy-factory", {
    artifacts: c.Post,
    registry: c.Erasure_Posts.registry,
    signer: deployer
  });

  [c.Feed.template, c.Feed.factory] = await run("deploy-factory", {
    artifacts: c.Feed,
    registry: c.Erasure_Posts.registry,
    signer: deployer
  });
});

task("deploy-registries", async (args, { run }, runSuper) => {
  console.log("Deploy Registries");
  const { deployer } = args;
  [c.Erasure_Posts.registry, _] = await run("deploy-contract", {
    name: "Erasure_Posts",
    params: [],
    signer: deployer
  });
  [c.Erasure_Agreements.registry, _] = await run("deploy-contract", {
    name: "Erasure_Agreements",
    params: [],
    signer: deployer
  });
});

task("deploy-nmr", async (args, env, runSuper) => {
  console.log("Deploy MockNMR");

  const { deployer } = args;
  const from = (await env.ethers.signers())[2];
  // await run('send-balance', {from, to: deployer});
  // console.log("NMR Signer balance updated");

  // TODO : why is this needed?
  // needs to increment the nonce to 1 by
  // await deployer.sendTransaction({ to: deployer.address, value: 0 });

  // const nmrAddress = "0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671";

  [c.NMR.wrap, _] = await run("deploy-contract", {
    name: "MockNMR",
    params: [],
    signer: deployer
  });
  console.log("MockNMR deployed");

  // console.log(contract.address, nmrAddress);
  // assert.equal(contract.address, nmrAddress);
});

const initializeFactory = async (contract, params, values, provider) => {
  console.log("Initializing");
  const tx = await contract.create(
    abiEncodeWithSelector("initialize", params, values)
  );
  // todo: missing name
  return provider.getTransactionReceipt(tx.hash);
};

const getWrapFromTx = (receipt, entity, signer) => {
  // TODO : does the instance contains the ABI?
  const interface = new ethers.utils.Interface(entity.factoryArtifact.abi);
  for (log of receipt.logs) {
    const event = interface.parseLog(log);
    if (event !== null && event.name === "InstanceCreated") {
      return new ethers.Contract(
        event.values.instance,
        entity.templateArtifact.abi,
        signer
      );
    }
  }
};

task(
  "deploy-full",
  "Deploy the full application",
  async (args, env, runSuper) => {
    const signers = await env.ethers.signers();
    const deployer = signers[0];
    const nmrSigner = signers[1];

    await run("deploy-nmr", { deployer: nmrSigner });
    await run("deploy-registries", { deployer });
    await run("deploy-factories", { deployer });

    console.log("Create Test Instances");

    const userAddress = deployer._address;
    const multihash = createMultihashSha256("multihash");
    const hash = ethers.utils.keccak256(hexlify("multihash"));

    console.log("userAddress:", userAddress);
    console.log("multihash:", multihash);
    console.log("hash:", hash);

    const provider = env.ethers.provider;

    await initializeFactory(
      c.Post.factory,
      ["address", "bytes", "bytes"],
      [userAddress, multihash, multihash],
      provider
    );
    const receipt = await initializeFactory(
      c.Feed.factory,
      ["address", "bytes", "bytes"],
      [userAddress, multihash, multihash],
      provider
    );
    c.Feed.wrap = await getWrapFromTx(receipt, c.Feed, deployer);

    const submitHash = async (entity, hash) => {
      const tx = await entity.wrap.submitHash(hash);
      const receipt = await provider.getTransactionReceipt(tx.hash);
      const interface = new ethers.utils.Interface(entity.templateArtifact.abi);
      for (log of receipt.logs) {
        const event = interface.parseLog(log);
        if (event !== null && event.name === "HashSubmitted") {
          console.log("Hashes:", event.values.hash, hash);
          // assert.equal(event.values.hash, hash);
        }
        console.log(`submitHash() | ${receipt.gasUsed} gas | Feed`);
      }
    };
    await submitHash(c.Feed, hash);

    await initializeFactory(
      c.SimpleGriefing.factory,
      ["address", "address", "address", "uint256", "uint8", "bytes"],
      [
        userAddress,
        userAddress,
        userAddress,
        ethers.utils.parseEther("1"),
        2,
        "0x0"
      ],
      provider
    );
    await initializeFactory(
      c.CountdownGriefing.factory,
      ["address", "address", "address", "uint256", "uint8", "uint256", "bytes"],
      [
        userAddress,
        userAddress,
        userAddress,
        ethers.utils.parseEther("1"),
        2,
        100000000,
        "0x0"
      ],
      provider
    );
  }
);

const main = async () => {
  process.on("unhandledRejection", function(error) {
    console.error(error);
    process.exit(1);
  });
  console.log("maaaain");
  if (args.exit_on_success) process.exit(0);
};

// var ArgumentParser = require("argparse").ArgumentParser;
// var parser = new ArgumentParser({
//   version: "0.0.1",
//   addHelp: true,
//   description: "Argparse example"
// });
// parser.addArgument(["-e", "--exit-on-success"], {
//   help: "foo bar",
//   action: "storeTrue"
// });
// var args = parser.parseArgs();

// main(args);
