/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { JubJub, JubJubInterface } from "../JubJub";

const _abi = [
  {
    inputs: [],
    name: "COFACTOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "JUBJUB_A",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "JUBJUB_D",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "L",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Q",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x61011c61003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe7300000000000000000000000000000000000000003014608060405260043610606a5760003560e01c8063e493ef8c116055578063e493ef8c1460ae578063eb83733c1460d4578063f7c2d5741460dd57600080fd5b80639357361e14606f5780639f13f76d146088575b600080fd5b6076600881565b60405190815260200160405180910390f35b60767f060c89ce5c263405370a08b6d0302b0bab3eedb83920ee0a677297dc392126f181565b60767f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f000000181565b6076620292fc81565b6076620292f88156fea26469706673582212204b5389195a5a4573abf529709835cd783f99f4429b875f5bf058d1a93395c06464736f6c634300080c0033";

export class JubJub__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<JubJub> {
    return super.deploy(overrides || {}) as Promise<JubJub>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): JubJub {
    return super.attach(address) as JubJub;
  }
  connect(signer: Signer): JubJub__factory {
    return super.connect(signer) as JubJub__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): JubJubInterface {
    return new utils.Interface(_abi) as JubJubInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): JubJub {
    return new Contract(address, _abi, signerOrProvider) as JubJub;
  }
}