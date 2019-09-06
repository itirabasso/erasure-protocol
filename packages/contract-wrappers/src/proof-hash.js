const Hash = require("ipfs-only-hash");

const createProofHashFromString = async string => {
  const buf = Buffer.from(string);
  const proofhash = await createProofHash(buf);
  return proofhash;
};

/**
 * Creates the IPFS proof hash in hex
 *
 * @param {ArrayBuffer} buf ArrayBuffer or Buffer (NodeJS) that represents file content in binary
 */
const createProofHash = async buf => {
  const multihash = await Hash.of(buf);
  return multihash;
};

const encodeFileNodeJS = async fileName => {
  const util = require("util");
  const fs = require("fs");
  const readFile = util.promisify(fs.readFile);
  const buf = await readFile(fileName);
  const multihash = await createProofHash(buf);
  return multihash;
};

// encodeFileNodeJS("background.jpg");

module.exports = {
  createProofHashFromString,
  createProofHash,
  encodeFileNodeJS
};
