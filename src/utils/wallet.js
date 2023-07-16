import { eddsa, babyJub, poseidon } from "circomlib";
const base64url = require("base64url");
import { Scalar, utils } from "ffjavascript";
import { ethers, BigNumber } from "ethers";
import { fix2Float } from "./float40";
import { tokenMap } from "./constant";
import ERC20ABI from "../common/abis/erc20.json";
import { addresses, rpcProviders } from "../common/globalCfg";
const HDKey = require("hdkey");

const HERMEZ_COMPRESSES_AMOUNT_TYPE = "HermezCompressedAmount";

const MockData = {
  ETH: {
    name: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
    id: 0,
    balance: 0,
    isApprove: true,
  },
  USDC: {
    name: "USDC",
    address: "0x1bc8779f8bC1764Eaf7105fD51597225A410cEB3",
    decimals: 18,
    id: 1,
    balance: 0,
    isApprove: false,
  },
  USDT: {
    name: "USDT",
    address: "0x4421Fb4287CCB09433666AA96dF8B94d45B108A4",
    decimals: 18,
    id: 2,
    balance: 0,
    isApprove: false,
  },
  WBTC: {
    name: "WBTC",
    address: "0x5f7e872767Db9086E143e9503424878d874fccBb",
    decimals: 18,
    id: 3,
    balance: 0,
    isApprove: false,
  },
};
export function test() {
  // console.log(Scalar);
  const amount = ethers.utils.parseUnits("100", 18).toString();
  const prv = "0000000000000000000000000000000000000000000000000000000000000001";
  const privateKey = Buffer(prv, "hex");
  const account = getAccount(privateKey, "1231212312");
  const tx = {
    chainId: 1,
    fromAccountIndex: 32,
    toAccountIndex: 35,
    tokenId: 1,
    nonce: 0,
    amount: amount,
  };
  const data = signTransaction(tx, tx, account.privateKey);
  console.log(data);
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
  console.log(Scalar.shl);
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

export function generatePublicAndPrivateKeyStringFromMnemonic(mnemonic, ethereum) {
  const hdkey = HDKey.fromMasterSeed(mnemonic);
  const privateKey = hdkey.privateKey;
  const eddsaAccount = getAccount(privateKey, ethereum);
  return eddsaAccount;
}

export async function getERC20Balance(userAddress, tokens) {
  const provider = rpcProviders.arbitrum;
  let balances = {};
  for (let i = 0; i < tokens.length; i++) {
    const erc20 = new ethers.Contract(tokenMap[tokens[i]].address, ERC20ABI, provider);
    const balance = await erc20.balanceOf(userAddress);
    balances[tokens[i]] = {
      token: tokens[i],
      balance: balance,
      id: tokenMap[tokens[i]].id,
      decimals: tokenMap[tokens[i]].decimals,
    };
  }

  return balances;
}

export async function getOnChainData(userAddress, tokens) {
  let onchainData = MockData;
  if (userAddress == null) {
    return onchainData;
  }
  const provider = rpcProviders.arbitrum;
  for (let i = 0; i < tokens.length; i++) {
    const erc20 = new ethers.Contract(tokenMap[tokens[i]].address, ERC20ABI, provider);
    const balance = await erc20.balanceOf(userAddress);
    const allowed = await erc20.allowance(userAddress, addresses.arbitrum.zkpaymentAddress);
    let isApprove = false;
    if (BigNumber.from(allowed).gt(0)) {
      isApprove = true;
    }
    // onchainData[tokens[i]] = {
    //   token: tokens[i],
    //   balance: balance,
    //   id: tokenMap[tokens[i]].id,
    //   decimals: tokenMap[tokens[i]].decimals,
    //   isApprove: isApprove,
    // };
    (onchainData[tokens[i]].balance = balance), (onchainData[tokens[i]].isApprove = isApprove);
  }
  return onchainData;
}

