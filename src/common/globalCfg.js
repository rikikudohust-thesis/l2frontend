import { providers } from "ethers";

export const addresses = {
  sepolia: {
    zkpaymentAddress: "0xb6C9f0CE324d7CF88E570CD1870796c6D85714dA",
  },
  arbitrum: {
    zkpaymentAddress: "0x05BB2BBFE49DF21F9Ff27baC91669258737167Ee",
    USDC: "0x1bc8779f8bC1764Eaf7105fD51597225A410cEB3",
    USDT: "0x4421Fb4287CCB09433666AA96dF8B94d45B108A4",
    WBTC: "0x5f7e872767Db9086E143e9503424878d874fccBb",
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  },
};

export const rpcProviders = {
  arbitrum: new providers.JsonRpcProvider("https://arbitrum-goerli.blockpi.network/v1/rpc/public"),
  sepolia: new providers.JsonRpcProvider("https://rpc.sepolia.org"),
};
