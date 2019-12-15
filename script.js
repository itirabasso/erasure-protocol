// const ethers = require('ethers')
const assert = require('assert')
const ganache = require('ganache-cli')
const {
  hexlify,
  createIPFShash,
  abiEncodeWithSelector,
} = require('./packages/testenv/utils')

const env = require('@nomiclabs/buidler')
const { ethers, utils } = require('ethers')

const main = async () => {
  console.log(``)
  console.log(`Create test instance from factories`)
  console.log(``)

  const userAddress = '0x6087555A70E2F96B7838806e7743041E035a37e5'
  const proofhash = ethers.utils.sha256(ethers.utils.toUtf8Bytes('proofhash'))
  const IPFShash = createIPFShash('multihash')
  console.log(`userAddress: ${userAddress}`)
  console.log(`proofhash: ${proofhash}`)
  console.log(`IPFShash: ${IPFShash}`)
  console.log(``)

  await env.run('erasure:erasure-setup')

  const nmr = await env.erasure.getContractInstance('MockNMR')

  const b = await env.ethereum.send('eth_getBalance', [await nmr.signer.getAddress(), 'latest'])

  // Feed
  const feed = await env.erasure.createInstance('Feed', [
    userAddress,
    proofhash,
    IPFShash,
  ])

  let tx = await feed.submitHash(proofhash);
  await tx.wait();
  let receipt = await env.ethers.provider.getTransactionReceipt(tx.hash);
  console.log('same hash?', proofhash === feed.interface.parseLog(receipt.logs[0]).values.hash)

  // // SimpleGriefing
  const griefing = await env.erasure.createInstance('SimpleGriefing', [
    userAddress,
    userAddress,
    userAddress,
    ethers.utils.parseEther('1'),
    2,
    IPFShash,
  ])

  // // CountdownGriefing
  const countdownGriefing = await env.erasure.createInstance(
    'CountdownGriefing',
    [
      userAddress,
      userAddress,
      userAddress,
      ethers.utils.parseEther('1'),
      2,
      100000000,
      IPFShash,
    ],
  )

  const abiEncoder = new ethers.utils.AbiCoder()
  // CountdownGriefingEscrow
  await env.erasure.createInstance(
    'CountdownGriefingEscrow',
    [
      userAddress,
      userAddress,
      userAddress,
      ethers.utils.parseEther('1'),
      ethers.utils.parseEther('1'),
      100000000,
      IPFShash,
      abiEncoder.encode(
        ['uint256', 'uint8', 'uint256'],
        [ethers.utils.parseEther('1'), 2, 100000000],
      ),
    ],
  )

  return 0;
}

main()
  .then(v => console.log('done', v))
  .catch(err => console.error(err))
