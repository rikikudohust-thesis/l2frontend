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
import { ethers } from "ethers";
import { tokenMap } from "src/utils/constant";
import { signTransaction } from "src/utils/wallet";
import axios from "axios";
import { MetamaskContext } from "src/Router";
import { url } from "src/common/globalCfg";

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
    address: "0x00000000",
    decimals: 18,
  },
  {
    name: "USDC",
    address: "0x00000001",
    decimals: 6,
  },
  {
    name: "USDT",
    address: "0x00000002",
    decimals: 6,
  },
  {
    name: "WBTC",
    address: "0x00000003",
    decimals: 8,
  },
];

function CreateTransactionModal({ handleClose, zkAccount }) {
  const [senderAnchorEl, setSenderAnchorEl] = useState(null);
  const [tokenAnchorEl, setTokenAnchorEl] = useState(null);
  const [sender, setSender] = useState(mockData[0].address);
  const [token, setToken] = useState(tokens[0].name);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { metamask } = useContext(MetamaskContext);

  function getBalance() {
    return ethers.utils.formatUnits(zkAccount.balance[token].value, 18);
  }

  async function handleTransfer() {
    setIsLoading(true);
    let toAccount;
    await axios
      .get(`${url}/v1/zkPayment/accountsEth?ethAddr=${receiver}&tokenID=${tokenMap[token].id}`)
      .then((res) => {
        toAccount = res.data.data;
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(toAccount)
    if (toAccount.length == 0) {
      setIsLoading(false);
      return;
    }

    const to = toAccount[0];
    const body = {
      chainId: 1,
      fromAccountIndex: zkAccount.balance[token].idx,
      tokenId: tokenMap[token].id,
      amount: ethers.utils.parseUnits(amount, 18).toString(),
      nonce: zkAccount.balance[token].nonce,
      toAccountIndex: to.idx,
    };
    const tx = signTransaction(body, body, metamask.privateKey);
    console.log(tx);

    await axios
      .post(`${url}/v1/zkPayment/transactions`, {
        fromIdx: tx.fromAccountIndex,
        toIdx: tx.toAccountIndex,
        tokenID: tx.tokenId,
        amount: tx.amount,
        nonce: tx.nonce,
        signature: tx.signature,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    setIsLoading(false);
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#111827",
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
          <CancelIcon sx={{ color: "#FFF" }} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "20px" }}>New Transaction</Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#161E2D",
          width: "80%",
          borderRadius: "15px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Box fontWeight="600">Sender:</Box>
        <Box px={2} width="100%">
          <Button
            sx={{
              textTransform: "none",
              borderRadius: "15px",
              fontFamily: "inherit",
              color: "inherit",
              border: "2px solid #5C80BC",
              width: "100%",
              height: "50px",
            }}
            onClick={(e) => setSenderAnchorEl(e.currentTarget)}
          >
            <Box width="95%">{zkAccount.owner}</Box>
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
                border: "2px solid #5C80BC",
                bgcolor: "#192238",
                borderRadius: "15px",
                color: "#FFF",
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
                        <Box display="flex" justifyContent="flex-start" width="100%">
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#161E2D",
          width: "80%",
          borderRadius: "15px",
          marginTop: "30px",
          padding: "20px",
        }}
      >
        <Box fontWeight="600">Receiver:</Box>
        <Box px={2} width="100%">
          <Input
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            disableUnderline
            color="#FFF"
            sx={{
              paddingLeft: "10px",
              height: "50px",
              color: "#FFF",
              fontFamily: "inherit",
              fontSize: "18px",
              fontWeight: "500",
              border: "2px solid #5C80BC",
              borderRadius: "15px",
              width: "100%",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#161E2D",
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
                border: "2px solid #5C80BC",
                width: "70%",
                height: "50px",
              }}
              onClick={(e) => setTokenAnchorEl(e.currentTarget)}
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
                  border: "2px solid #5C80BC",
                  bgcolor: "#192238",
                  borderRadius: "15px",
                  color: "#FFF",
                  paddingX: "20px",
                }}
              >
                <MenuList>
                  {tokens.map(
                    (item) =>
                      item.name !== token && (
                        <MenuItem sx={{ fontFamily: "Lexend Exa" }} onClick={() => setToken(item.name)}>
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
          <Box display="flex" justifyContent="space-between" sx={{ fontWeight: "600" }}>
            <Box>Amount</Box>
            <Box>
              Your balance : {getBalance()} {token}
            </Box>
          </Box>
          <Box pt={2}>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              disableUnderline
              color="#FFF"
              sx={{
                paddingLeft: "10px",
                height: "50px",
                color: "#FFF",
                fontFamily: "inherit",
                fontSize: "18px",
                fontWeight: "500",
                border: "2px solid #5C80BC",
                borderRadius: "15px",
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
                      color: "#FFF",
                      border: "1px solid #5C80BC",
                      borderRadius: "10px",
                      fontFamily: "inherit",
                      marginRight: "5px",
                    }}
                    onClick={() => setAmount(getBalance() - 1)}
                  >
                    MAX
                  </Button>
                </InputAdornment>
              }
            />
          </Box>
        </Box>
      </Box>
      <Box width="90%" display="flex" justifyContent="flex-end" py={3}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button
            sx={{
              width: "20%",
              fontSize: "15px",
              fontWeight: "600",
              textTransform: "none",
              color: "#FFF",
              border: "1px solid #5C80BC",
              borderRadius: "10px",
              fontFamily: "inherit",
            }}
            onClick={async () => {
              await handleTransfer();
            }}
          >
            Send
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default CreateTransactionModal;
