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
  // const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
  const receipt = await tx.wait();
  // console.log(tx, receipt);
  // receipt.logs.forEach(
  // log => console.log('log:', log)
  // log.events.find(
  //   emittedEvent => emittedEvent.event === expectedEvent,
  //   `Expected event ${expectedEvent} was not emitted.`
  // )
  // );
  const event = receipt.events.find(event => event.event === expectedEvent);
  // console.log("eveneeent(log)", event);
  assert.isDefined(event);
};

const emitWithArgs = async (promise, expectedEvent, args) => {
  // let { txReceipt } = await executeTransaction(promise);
  const tx = await promise;
  const receipt = await tx.wait();
  let event;
  if (typeof(expectedEvent) === 'string') {
    event = receipt.events.find(event => event === expectedEvent);
  } else {
    event = receipt.events[0]
    args = expectedEvent;
  }
  // const event =

  //   expectedEvent === "string"
  //     ? receipt.events.find(event => event === expectedEvent)
  //     : receipt.events[0];
  // console.log(event, event.args, event.args.length);
  const argsLogged = [];
  for (let i = 0; i < event.args.length; i++) {
    argsLogged.push(event.args[i]);
  }
  // console.log('a', argsLogged, args);
  assert.equal(
    argsLogged.toString(),
    args.toString(),
    `Event ${expectedEvent} was not emitted with expected arguments ${args}.`
  );
};

before(async () => {
  // [this.deployer, this.MockNMR] = await setupDeployment();
  // console.log(global.assert)
  assert.revert = assertRevert;
  assert.revertWith = assertRevertWith;
  assert.emit = emit;
  assert.emitWithArgs = emitWithArgs;
});
