import { eddsa, babyJub, poseidon } from "circomlib";
const base64url = require("base64url");
import { Scalar, utils } from "ffjavascript";
import { ethers } from "ethers";
import { fix2Float } from "./float40";

const HERMEZ_COMPRESSES_AMOUNT_TYPE = "HermezCompressedAmount";

export function test() {
  // console.log(Scalar);
  const amount = ethers.utils.parseUnits("100", 18).toString()
  const prv = "0000000000000000000000000000000000000000000000000000000000000001";
  const privateKey = Buffer(prv, "hex");
  const account = getAccount(privateKey, "1231212312");
  const tx = {
    chainId: 1,
    fromAccountIndex: 32,
    toAccountIndex: 35,
    tokenId: 1,
    nonce: 0,
    amount: amount
  };
  const data = signTransaction(tx, tx, account.privateKey);
  console.log(data)
}


export function getAccount(privateKey, ethAddr) {
  if (privateKey.length !== 32) {
    throw new Error("Private key buffer must be 32 bytes");
  }

  const publicKey = eddsa.prv2pub(privateKey);
  //   privateKey = privateKey;
  const publicKeyStr = [publicKey[0].toString(), publicKey[1].toString()];
  const publicKeyHex = [publicKey[0].toString(16), publicKey[1].toString(16)];

  const compressedPublicKey = utils.leBuff2int(babyJub.packPoint(publicKey));
  const publicKeyCompressed = compressedPublicKey.toString();
  const publicKeyCompressedHex = ethers.utils.hexZeroPad(`0x${compressedPublicKey.toString(16)}`, 32).slice(2);
  //   const publicKeyBase64 = hexToBase64BJJ(publicKeyCompressedHex);
  console.log(publicKeyCompressed);
  console.log(publicKeyCompressedHex);
  console.log(ethAddr);

  return {
    privateKey,
    publicKeyCompressed,
    publicKeyCompressedHex,
    ethAddr,
  };
}

function buildElement1(tx) {
//   console.log(Scalar.e(0));
  let res = Scalar.e(0);

  res = Scalar.add(res, Scalar.fromString(tx.toEthereumAddress || "0", 16)); // ethAddr --> 160 bits
//   console.log("Here")
  console.log(Scalar.shl)
  res = Scalar.add(res, Scalar.shl(fix2Float(tx.amount), 160)); // amountF --> 40 bits
  res = Scalar.add(res, Scalar.shl(tx.maxNumBatch || 0, 200)); // maxNumBatch --> 32 bits

  return res;
}

function buildTxCompressedData(tx) {
  const signatureConstant = Scalar.fromString("3322668559");
  let res = Scalar.e(0);

  res = Scalar.add(res, signatureConstant); // SignConst --> 32 bits
  res = Scalar.add(res, Scalar.shl(tx.chainId || 0, 32)); // chainId --> 16 bits
  res = Scalar.add(res, Scalar.shl(tx.fromAccountIndex || 0, 48)); // fromIdx --> 48 bits
  res = Scalar.add(res, Scalar.shl(tx.toAccountIndex || 0, 96)); // toIdx --> 48 bits
  res = Scalar.add(res, Scalar.shl(tx.tokenId || 0, 144)); // tokenID --> 32 bits
  res = Scalar.add(res, Scalar.shl(tx.nonce || 0, 176)); // nonce --> 40 bits
  res = Scalar.add(res, Scalar.shl(tx.fee || 0, 216)); // userFee --> 8 bits
  res = Scalar.add(res, Scalar.shl(tx.toBjjSign ? 1 : 0, 224)); // toBjjSign --> 1 bit

  return res;
}

function buildTransactionHashMessage(encodedTransaction) {
  const txCompressedData = buildTxCompressedData(encodedTransaction);
  console.log(`txCompressedData: ${txCompressedData}`);
  const element1 = buildElement1(encodedTransaction);
  console.log(`element1: ${element1}`);
  console.log(`toBjjAy: ${encodedTransaction.toBjjAy}`);
  console.log(`rqTxCompressDataV2: ${encodedTransaction.rqTxCompressedDataV2}`);
  console.log(`rqToEthereumAddress: ${encodedTransaction.rqToEthereumAddress}`);
  console.log(`rqToBjjAy: ${encodedTransaction.rqToBjjAy}`);
  const h = poseidon([
    txCompressedData,
    element1,
    Scalar.fromString(encodedTransaction.toBjjAy || "0", 16),
    Scalar.e(encodedTransaction.rqTxCompressedDataV2 || 0),
    Scalar.fromString(encodedTransaction.rqToEthereumAddress || "0", 16),
    Scalar.fromString(encodedTransaction.rqToBjjAy || "0", 16),
  ]);

  return h;
}

export function signTransaction(transaction, encodedTransaction, prv) {
  const hashMessage = buildTransactionHashMessage(encodedTransaction);
  console.log(`hashMessage: ${hashMessage}`);
  const signature = eddsa.signPoseidon(prv, hashMessage);
  console.log("signature: ", signature);
  const packedSignature = eddsa.packSignature(signature);
  transaction.signature = packedSignature.toString("hex");
  console.log("packageSignature: ", packedSignature.toString("hex"));

  return transaction;
}

// Compress Amount
function isHermezCompressedAmount(instance) {
  return instance.type === HERMEZ_COMPRESSES_AMOUNT_TYPE && instance instanceof HermezCompressedAmount;
}
