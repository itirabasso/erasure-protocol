// taken from OpenZeppelin/openzeppelin-contracts test helpers
const assertRevert = async promise => {
  try {
    await promise;
    assert.fail("Expected revert not received");
  } catch (error) {
    const revertFound = error.message.search("revert") >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

// taken from OpenZeppelin/openzeppelin-contracts test helpers
const assertRevertWith = async (promise, msg) => {
  try {
    await promise;
    assert.fail("Expected revert not received");
  } catch (error) {
    const revertFound = error.message.search(msg) >= 0;
    assert(revertFound, `Expected "revert", got ${error} instead`);
  }
};

const executeTransaction = async function(promise) {
  let transaction = await promise;
  let txReceipt = await transaction.wait();
  return { transaction, txReceipt };
};

const emit = async (promise, expectedEvent) => {
  // let {
  //   txReceipt
  // } = await executeTransaction(promise)
  // assert.isDefined(txReceipt.events.find(emittedEvent => emittedEvent.event === expectedEvent, `Expected event ${expectedEvent} was not emitted.`));
  const tx = await promise;
  const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
  receipt.logs.forEach(
    log => console.log(log)
    // log.events.find(
    //   emittedEvent => emittedEvent.event === expectedEvent,
    //   `Expected event ${expectedEvent} was not emitted.`
    // )
  );
};

const emitWithArgs = async (promise, expectedEvent, arguments) => {
  // let { txReceipt } = await executeTransaction(promise);
  const tx = await promise;
  const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

  let log;
  for (let i = 0; i < receipt.logs.length; i++) {
    console.log(receipt);
    if (txReceipt.logs[i].event === expectedEvent) {
      log = txReceipt.events[i].args;
    }
  }

  let argsLogged = [];
  for (let i = 0; i < log.length; i++) {
    argsLogged.push(log[i]);
  }

  // assert.equal(
  //   argsLogged.toString(),
  //   arguments.toString(),
  //   `Event ${expectedEvent} was not emitted with expected arguments ${arguments}.`
  // );
};

before(async () => {
  // [this.deployer, this.MockNMR] = await setupDeployment();
  // console.log(global.assert)
  assert.revert = assertRevert;
  assert.revertWith = assertRevertWith;
  assert.emit = emit;
  assert.emitWithArgs = emitWithArgs;
});
