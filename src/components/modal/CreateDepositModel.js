import {
  Box,
  Button,
  Input,
  InputAdornment,
  IconButton,
  MenuList,
  MenuItem,
  Popover,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { useContext, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { AccountContext, MetamaskContext } from "src/Router";
// import { approveERC20, generatePublicAndPrivateKeyStringFromMnemonic } from "src/utils/wallet";
import { tokenMap } from "src/utils/constant";

//IMPORT FOR CONTRACT
import ZKPAYMENTABI from "../../common/abis/zkpayment.json";
import ERC20ABI from "../../common/abis/erc20.json";
import { addresses, rpcProviders } from "src/common/globalCfg";
import { ethers } from "ethers";
import { fix2Float } from "src/utils/float40";

function BNToNumber(value, decimals) {
  return ethers.utils.formatUnits(value, decimals);
}

const babyjub0 = 0;
const fromIdx0 = 0;
const loadAmountF0 = 0;
const amountF0 = 0;
const tokenID0 = 0;
const toIdx0 = 0;
const mockData = [
  {
    nameTag: "Account #1",
    owner: "0x242ed78bf0fe7672ff01ae6de558e45b3749f197",
    address: "0x2a26bca625b223971909dd88fc93faeb050dc5b3",
    balance: {
      USDT: 500000,
      USDC: 200000,
      ETH: 50,
      WBTC: 20,
    },
  },
  {
    nameTag: "Account #2",
    owner: "0xb3eC5Db932736D0203004FD7208b9b007d166B35",
    address: "0x637dD76d7a4a80Ad9f9f09830B50DC384454bF27",
    balance: {
      USDT: 200000,
      USDC: 500000,
      ETH: 20,
      WBTC: 10,
    },
  },
];
const tokens = [
  {
    name: "ETH",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    decimals: 18,
  },
  {
    name: "USDC",
    address: "0x1bc8779f8bC1764Eaf7105fD51597225A410cEB3",
    decimals: 18,
  },
  {
    name: "USDT",
    address: "0x4421Fb4287CCB09433666AA96dF8B94d45B108A4",
    decimals: 18,
  },
  {
    name: "WBTC",
    address: "0x5f7e872767Db9086E143e9503424878d874fccBb",
    decimals: 18,
  },
];

function CreateDepositModal({ handleClose, balanceData, zkAccount }) {
  const [senderAnchorEl, setSenderAnchorEl] = useState(null);
  const [tokenAnchorEl, setTokenAnchorEl] = useState(null);
  const [sender, setSender] = useState(mockData[0].address);
  const [token, setToken] = useState(tokens[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);

  const { metamask } = useContext(MetamaskContext);
  const { mnemonic } = useContext(AccountContext);

  async function handleDeposit() {
    const arbitrumProvider = rpcProviders.arbitrum;
    const zkpayment = new ethers.Contract(
      addresses.arbitrum.zkpaymentAddress,
      ZKPAYMENTABI,
      arbitrumProvider
    );
    const txData = await zkpayment.populateTransaction
      .addL1Transaction(
        babyjub0,
        zkAccount.balance[token].idx,
        fix2Float(ethers.utils.parseUnits(amount, tokenMap[token].decimals)),
        amountF0,
        tokenMap[token].id,
        toIdx0
      )
      .then((tx) => tx.data);

    const params = [
      {
        from: metamask.ethAddr,
        to: addresses.arbitrum.zkpaymentAddress,
        value: 0,
        data: txData,
      },
    ];

    await window.ethereum
      .request({ method: "eth_sendTransaction", params })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    console.log("Deposit");
  }

  async function handleCreateAccount() {
    const arbitrumProvider = rpcProviders.arbitrum;
    const zkpayment = new ethers.Contract(
      addresses.arbitrum.zkpaymentAddress,
      ZKPAYMENTABI,
      arbitrumProvider
    );
    const txData = await zkpayment.populateTransaction
      .addL1Transaction(
        metamask.publicKeyCompressed,
        0,
        fix2Float(ethers.utils.parseUnits(amount, tokenMap[token].decimals)),
        0,
        tokenMap[token].id,
        0
      )
      .then((tx) => tx.data);

    const params = [
      {
        from: metamask.ethAddr,
        to: addresses.arbitrum.zkpaymentAddress,
        value: 0,
        data: txData,
      },
    ];

    await window.ethereum
      .request({ method: "eth_sendTransaction", params })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    console.log("Deposit");
  }

  async function handleApprove() {
    const provider = rpcProviders.arbitrum;
    const erc20 = new ethers.Contract(
      tokenMap[token].address,
      ERC20ABI,
      provider
    );
    const bigApprove = ethers.utils.parseUnits(
      "10000000000000000000000000",
      18
    );

    const txData = await erc20.populateTransaction
      .approve(addresses.arbitrum.zkpaymentAddress, bigApprove)
      .then((tx) => tx.data);
    console.log(txData);
    const params = [
      {
        from: metamask.ethAddr,
        to: tokenMap[token].address,
        value: 0,
        data: txData,
      },
    ];

    await window.ethereum
      .request({ method: "eth_sendTransaction", params })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  async function handleAction() {
    if (balanceData[token]) {
      setIsLoading(true);
      if (!balanceData[token].isApprove) await handleApprove();
      if (zkAccount.balance[token].idx === 0) {
        await handleCreateAccount();
      } else {
        await handleDeposit();
      }
      setIsLoading(false);
    }
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fefae0",
        width: "40%",
        height: "60%",
        borderRadius: "25px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "10px",
          paddingRight: "10px",
          width: "100%",
        }}
      >
        <IconButton onClick={handleClose}>
          <CancelIcon sx={{ color: "#000" }} />
        </IconButton>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}
      >
        New Deposit
      </Box>
      {/* SENDER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#dda15e",
          width: "80%",
          borderRadius: "15px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Box fontWeight="600">Ethereum:</Box>
        <Box px={2} width="100%">
          <Button
            sx={{
              textTransform: "none",
              borderRadius: "15px",
              fontFamily: "inherit",
              color: "inherit",
              bgcolor: "#fefae0",
              border: "2px solid #bc6c25",
              width: "100%",
              height: "50px",
              "&:hover": {
                bgcolor: "#fefae0",
              },
            }}
            onClick={(e) => setSenderAnchorEl(e.currentTarget)}
          >
            <Box width="95%">{metamask ? metamask.ethAddr : "undefined"}</Box>
            <Box width="5%" display="flex" alignItems="center">
              <KeyboardArrowRightIcon />
            </Box>
          </Button>
          <Popover
            anchorEl={senderAnchorEl}
            sx={{
              ".MuiPopover-paper": {
                borderRadius: "15px",
              },
            }}
            open={Boolean(senderAnchorEl)}
            onClose={() => setSenderAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box
              sx={{
                border: "2px solid #bc6c25",
                bgcolor: "#fefae0",
                borderRadius: "15px",
                color: "#000",
                paddingX: "13px",
              }}
            >
              <MenuList>
                {mockData.map(
                  (item) =>
                    item.address !== sender && (
                      <MenuItem
                        sx={{
                          fontFamily: "Lexend Exa",
                          fontSize: "15px",
                          fontWeight: "500",
                          paddingY: "0px",
                        }}
                        onClick={() => setSender(item.address)}
                      >
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          width="100%"
                        >
                          {item.address}
                        </Box>
                      </MenuItem>
                    )
                )}
              </MenuList>
            </Box>
          </Popover>
        </Box>
      </Box>
      {/* ------------- */}
      {/* BJJ ADDRESSS */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#dda15e",
          width: "80%",
          borderRadius: "15px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Box fontWeight="600">BJJ:</Box>
        <Box px={2} width="100%">
          <Button
            sx={{
              textTransform: "none",
              borderRadius: "15px",
              fontFamily: "inherit",
              color: "inherit",
              border: "2px solid #bc6c25",
              bgcolor: "#fefae0",
              width: "100%",
              height: "50px",
              "&:hover": {
                bgcolor: "#fefae0",
              },
            }}
            onClick={(e) => setSenderAnchorEl(e.currentTarget)}
          >
            <Box width="95%">
              {metamask ? metamask.publicKeyCompressedHex : "undefined"}
            </Box>
            <Box width="5%" display="flex" alignItems="center">
              <KeyboardArrowRightIcon />
            </Box>
          </Button>
          <Popover
            anchorEl={senderAnchorEl}
            sx={{
              ".MuiPopover-paper": {
                borderRadius: "15px",
              },
            }}
            open={Boolean(senderAnchorEl)}
            onClose={() => setSenderAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box
              sx={{
                border: "2px solid #bc6c25",
                bgcolor: "#FEFAE0",
                borderRadius: "15px",
                color: "#000",
                paddingX: "13px",
              }}
            >
              <MenuList>
                {mockData.map(
                  (item) =>
                    item.address !== sender && (
                      <MenuItem
                        sx={{
                          fontFamily: "Lexend Exa",
                          fontSize: "15px",
                          fontWeight: "500",
                          paddingY: "0px",
                        }}
                        onClick={() => setSender(item.address)}
                      >
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          width="100%"
                        >
                          {item.address}
                        </Box>
                      </MenuItem>
                    )
                )}
              </MenuList>
            </Box>
          </Popover>
        </Box>
      </Box>
      {/* ---------- */}
      {/* TOKEN AND AMOUNT */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "#dda15e",
          width: "80%",
          borderRadius: "15px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Box sx={{ width: "30%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ fontWeight: "600" }}>Token</Box>
          <Box pt={2} width="100%">
            <Button
              sx={{
                borderRadius: "15px",
                fontFamily: "inherit",
                color: "inherit",
                bgcolor: "#FEFAE0",
                border: "2px solid #bc6c25",
                width: "70%",
                height: "50px",
                "&:hover": {
                  bgcolor: "#fefae0",
                },
              }}
              onClick={(e) => {
                setTokenAnchorEl(e.currentTarget);
              }}
            >
              <Box width="80%">{token}</Box>
              <Box width="20%" display="flex" alignItems="center">
                <KeyboardArrowRightIcon />
              </Box>
            </Button>
            <Popover
              anchorEl={tokenAnchorEl}
              sx={{
                ".MuiPopover-paper": {
                  borderRadius: "15px",
                },
              }}
              open={Boolean(tokenAnchorEl)}
              onClose={() => setTokenAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Box
                sx={{
                  border: "2px solid #bc6c25",
                  bgcolor: "#FEFAE0",
                  borderRadius: "15px",
                  color: "#000",
                  paddingX: "20px",
                }}
              >
                <MenuList>
                  {tokens.map(
                    (item) =>
                      item.name !== token && (
                        <MenuItem
                          sx={{ fontFamily: "Lexend Exa" }}
                          onClick={() => setToken(item.name)}
                        >
                          {item.name}
                        </MenuItem>
                      )
                  )}
                </MenuList>
              </Box>
            </Popover>
          </Box>
        </Box>
        <Box sx={{ width: "70%", display: "flex", flexDirection: "column" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            sx={{ fontWeight: "600" }}
          >
            <Box>Amount</Box>
            <Box>
              Your balance :{" "}
              {balanceData[token]
                ? BNToNumber(
                    balanceData[token].balance,
                    balanceData[token].decimals
                  )
                : 0}{" "}
              {token}
            </Box>
          </Box>
          <Box pt={2}>
            <Input
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              type="number"
              disableUnderline
              color="#000"
              sx={{
                paddingLeft: "10px",
                height: "50px",
                color: "#000",
                fontFamily: "inherit",
                fontSize: "18px",
                fontWeight: "500",
                border: "2px solid #bc6c25",
                borderRadius: "15px",
                bgcolor: "#fefae0",
                width: "100%",
                "& input[type=number]": {
                  "-moz-appearance": "textfield",
                },
                "& input[type=number]::-webkit-outer-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  "-webkit-appearance": "none",
                  margin: 0,
                },
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Button
                    sx={{
                      width: "5%",
                      fontSize: "10px",
                      fontWeight: "600",
                      textTransform: "none",
                      color: "#000",
                      border: "1px solid #bc6c25",
                      borderRadius: "10px",
                      fontFamily: "inherit",
                      marginRight: "5px",
                    }}
                    onClick={() => {
                      setAmount(
                        balanceData[token]
                          ? BNToNumber(
                              balanceData[token].balance,
                              balanceData[token].decimals
                            )
                          : 0
                      );
                    }}
                  >
                    MAX
                  </Button>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      {/* .......... */}
      <Box width="90%" display="flex" justifyContent="flex-end" py={3}>
        <Button
          sx={{
            width: "20%",
            fontSize: "15px",
            fontWeight: "600",
            textTransform: "none",
            color: "#000",
            border: "1px solid #bc6c25",
            borderRadius: "10px",
            fontFamily: "inherit",
          }}
          onClick={async () => await handleAction()}
        >
          {/* Finish */}
          {isLoading ? (
            <CircularProgress sx={{ color: "#000", fontSize: "inherit" }} />
          ) : !balanceData[token] ? (
            "Not Active"
          ) : balanceData[token].isApprove ? (
            "Deposit"
          ) : (
            "Deposit"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default CreateDepositModal;
