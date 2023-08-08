import { ethers } from "ethers";

const EIP_712_PROVIDER = "ZKPayment Network";
const CREATE_ACCOUNT_AUTH_MESSAGE = "Account creation";
const WITHDRAW_MESSAGE = "Withdraw";
const TX_MESSAGE = "Tx";
const EIP_712_VERSION = "1";

export async function signCreateAccountAuthorization(signer, bJJ, address) {
  const chainId = 1;

  const domain = {
    name: EIP_712_PROVIDER,
    version: EIP_712_VERSION,
    chainId,
    verifyingContract: address,
  };
  const types = {
    Authorise: [
      { name: "Provider", type: "string" },
      { name: "Authorisation", type: "string" },
      { name: "BJJKey", type: "bytes32" },
    ],
  };
  const value = {
    Provider: EIP_712_PROVIDER,
    Authorisation: CREATE_ACCOUNT_AUTH_MESSAGE,
    BJJKey: bJJ,
  };
  const signature = await signer._signTypedData(domain, types, value);
  const verify = await ethers.utils.verifyTypedData(
    domain,
    types,
    value,
    signature
  );
  console.log(verify);
  return signature;
}

export async function signWithdraw(signer, bJJ, receiver, address) {
  const chainId = 1;

  const domain = {
    name: EIP_712_PROVIDER,
    version: EIP_712_VERSION,
    chainId,
    verifyingContract: address,
  };
  const types = {
    Authorise: [
      { name: "Provider", type: "string" },
      { name: "Authorisation", type: "string" },
      { name: "BJJKey", type: "bytes32" },
      { name: "EthAddr", type: "address" },
    ],
  };
  const value = {
    Provider: EIP_712_PROVIDER,
    Authorisation: WITHDRAW_MESSAGE,
    BJJKey: bJJ,
    EthAddr: receiver,
  };
  const signature = await signer._signTypedData(domain, types, value);
  console.log(ethers.utils.verifyTypedData(domain, types, value, signature));

  return signature;
}

export async function signTx(signer, toIdx, receiver, address) {
  const chainId = 1;

  const domain = {
    name: EIP_712_PROVIDER,
    version: EIP_712_VERSION,
    chainId,
    verifyingContract: address,
  };
  const types = {
    Authorise: [
      { name: "Provider", type: "string" },
      { name: "Authorisation", type: "string" },
      { name: "ToIdx", type: "uint48" },
      { name: "EthAddr", type: "address" },
    ],
  };
  const value = {
    Provider: EIP_712_PROVIDER,
    Authorisation: TX_MESSAGE,
    ToIdx: toIdx,
    EthAddr: receiver,
  };
  const signature = await signer._signTypedData(domain, types, value);
  return signature
}
