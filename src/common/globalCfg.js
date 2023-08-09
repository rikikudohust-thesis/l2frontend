import { providers } from "ethers";

// export const url = "http://34.87.26.249:8080"
export const url = "http://127.0.0.1:8080"
export const addresses = {
  sepolia: {
    zkpaymentAddress: "0x85f30D7589c56e0056284E190CB5a9BABbB2419e",
  },
  arbitrum: {
    zkpaymentAddress: "0x1037006511412008eA908bC267f768Cada5e7e09",
    USDC: {
      name: "USDC",
      address: "0x229Ca9005ed3bbf8Dd29e8f11E4fF94252933037",
      decimals: 18,
      symbols: "USDC",
    },
    USDT: {
      name: "USDT",
      address: "0x17b6f8C5D1818b12f8960A1808aF62bf24f6B2f5",
      decimals: 18,
      symbols: "USDT",
    },
    WBTC: {
      name: "WBTC",
      address: "0x7591Dc38F372c3d9D17170Bb11b5BaEa522a423b",
      decimals: 18,
      symbols: "WBTC",
    },
    ETH: {
      name: 'ETH',
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      symbols: "ETH"
    },
  },
};

export const rpcProviders = {
  arbitrum: new providers.JsonRpcProvider(
    "https://arbitrum-goerli.blockpi.network/v1/rpc/public"
  ),
  sepolia: new providers.JsonRpcProvider("https://rpc.sepolia.org"),
  goerli: new providers.JsonRpcProvider(
    "https://goerli.blockpi.network/v1/rpc/public"
  ),
};

export const networkName = {
  421613: "arbitrum_goerli",
  5: "goerli",
  11155111: "sepolia",
};

export const contracts = {
  1: {
    zkPayment: "",
    poseidon2: "0x320C63710C8Fca621235f89E828C87E6f38C049B",
    poseidon3: "0x52145aFA2e7Bbc0af9229Ee041CD827F464b23e9",
    poseidon4: "0xB74ed5b0DAF4d6E9E22538b0f2736FcB92e28B84",
    rollup_verifier: "0xe2ADD1db8327aD4d416Db5Aa9Ce267623D1f482c",
    withdraw_verifier: "0x27232Cf3e0D4f3881bbf4447B6Ec28C4F7036E26",
    tokens: {
      USDC: "0x1bc8779f8bC1764Eaf7105fD51597225A410cEB3",
      USDT: "0x4421Fb4287CCB09433666AA96dF8B94d45B108A4",
      WBTC: "0x5f7e872767Db9086E143e9503424878d874fccBb",
    },
  },
  2: {
    zkPayment: "",
    poseidon2: "",
    poseidon3: "",
    poseidon4: "",
    rollup_verifier: "",
    withdraw_verifier: "",
    tokens: {
      USDC: "",
      USDT: "",
      WBTC: "",
    },
  },
  5: {
    zkPayment: "",
    poseidon2: "",
    poseidon3: "",
    poseidon4: "",
    rollup_verifier: "",
    withdraw_verifier: "",
    tokens: {
      USDC: "",
      USDT: "",
      WBTC: "",
    },
  },
  421613: {
    zkPayment: "0x1037006511412008eA908bC267f768Cada5e7e09",
    poseidon2: "0x3A2aBbd97a437907AcB85DFB40a6D27D1C368636",
    poseidon3: "0x8e5F16721d9089893e4c4358C1C68392659f0aaB",
    poseidon4: "0x9f6D6f7C8b818E4Cd7bdCF9c7937A93A5a8c8a76",
    rollup_verifier: "0x03144a1bb146138ee7310afCC4498A9875f7Ca94",
    withdraw_verifier: "0x6be3F7f48a2d921aE63490F8C8abdadBED78a37C",
    tokens: {
      USDC: "0x229Ca9005ed3bbf8Dd29e8f11E4fF94252933037",
      USDT: "0x17b6f8C5D1818b12f8960A1808aF62bf24f6B2f5",
      WBTC: "0x7591Dc38F372c3d9D17170Bb11b5BaEa522a423b",
    },
  },
  11155111: {
    zkPayment: "",
    poseidon2: "",
    poseidon3: "",
    poseidon4: "",
    rollup_verifier: "",
    withdraw_verifier: "",
    tokens: {
      USDC: "",
      USDT: "",
      WBTC: "",
    },
  },
};
