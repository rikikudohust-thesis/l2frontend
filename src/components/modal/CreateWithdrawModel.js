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
import { addresses, rpcProviders } from "src/common/globalCfg";
import { ethers } from "ethers";
import ZKPAYMENTABI from "../../common/abis/zkpayment.json";
import ERC20ABI from "../../common/abis/erc20.json";
import { fix2Float } from "src/utils/float40";
import { tokenMap } from "src/utils/constant";
import { MetamaskContext, EddsaAccountContext } from "src/Router";
import { signTx } from "src/utils/permit";
import { useNavigate } from "react-router-dom";

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
const babyjub0 = 0;
const fromIdx0 = 0;
const loadAmountF0 = 0;
const amountF0 = 0;
const tokenID0 = 0;
const toIdx0 = 0;

function CreateWithdrawModal({ zkAccount, handleClose }) {
  const [senderAnchorEl, setSenderAnchorEl] = useState(null);
  const [tokenAnchorEl, setTokenAnchorEl] = useState(null);
  const [sender, setSender] = useState(mockData[0].address);
  const [token, setToken] = useState(tokens[0].name);
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { metamask } = useContext(MetamaskContext);
  const { eddsaAccount } = useContext(EddsaAccountContext);

  function getBalance() {
    return ethers.utils.formatUnits(zkAccount.balance[token].value, 18);
  }

  async function handleWithdraw() {
    setIsLoading(true);
    const arbitrumProvider = rpcProviders.arbitrum;
    const zkpayment = new ethers.Contract(
      addresses.arbitrum.zkpaymentAddress,
      ZKPAYMENTABI,
      arbitrumProvider
    );
    const signers = new ethers.Wallet(
      eddsaAccount.privateKey,
      arbitrumProvider
    );
    const signature = await signTx(signers, 1, metamask, zkpayment.address);
    console.log("here");

    const txData = await zkpayment.populateTransaction
      .addL1Transaction(
        babyjub0,
        zkAccount.balance[token].idx,
        loadAmountF0,
        fix2Float(ethers.utils.parseUnits(amount, tokenMap[token].decimals)),
        tokenMap[token].id,
        1,
        signature
      )
      .then((tx) => tx.data);

    const params = [
      {
        from: metamask,
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

    setIsLoading(false);
    navigate("/history");
  }

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#FEFAE0",
        width: "40%",
        height: "40%",
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
        New Withdraw
      </Box>
      <Box
        sx={{
          display: "flex",
          bgcolor: "#DDA15E",
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
                border: "2px solid #BC6C25",
                width: "70%",
                height: "50px",
                bgcolor: "#FEFAE0",
                "&:hover": {
                  bgcolor: "#FEFAE0",
                },
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
                  border: "2px solid #BC6C25",
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
              Your balance : {getBalance()} {token}
            </Box>
          </Box>
          <Box pt={2}>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              disableUnderline
              color="#000"
              sx={{
                paddingLeft: "10px",
                height: "50px",
                color: "#000",
                fontFamily: "inherit",
                bgcolor: "#FEFAE0",
                fontSize: "18px",
                fontWeight: "500",
                border: "2px solid #BC6C25",
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
                      color: "#000",
                      border: "1px solid #BC6C25",
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
        <Button
          sx={{
            width: "20%",
            fontSize: "15px",
            fontWeight: "600",
            textTransform: "none",
            color: "#000",

            border: "1px solid #BC6C25",
            borderRadius: "10px",
            fontFamily: "inherit",
          }}
          onClick={async () => await handleWithdraw()}
        >
          {isLoading ? (
            <CircularProgress sx={{ color: "#000", fontSize: "inherit" }} />
          ) : (
            "Withdraw"
          )}
        </Button>
      </Box>
    </Box>
  );
}

export default CreateWithdrawModal;
