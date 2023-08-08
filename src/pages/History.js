import axios from "axios";
import {
  MenuList,
  MenuItem,
  Button,
  Popover,
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ethers } from "ethers";
import { MetamaskContext, EddsaAccountContext } from "src/Router";
import { stateTx, tokenEnum } from "src/utils/constant";
import { url } from "src/common/globalCfg";

const addresses = [
  "0xcB714F263cBc742A79745faf2B2c47367460D26A",
  "0x990b82dc8ab6134f482d2cad3bba11c537cd7b45",
];

function truncateString(str, num) {
  if (str.length > num || num <= 7) {
    return str.slice(0, num - 7) + "..." + str.slice(-3);
  } else {
    return str;
  }
}

function History() {
  const [accountInfo, setAccountInfo] = useState([]);
  const [transactionInfo, setTransactionInfo] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sender, setSender] = useState(addresses[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInterval, setIsLoadingInterval] = useState(false);
  const [ethPrice, setETHPrice] = useState(0);
  const { metamask } = useContext(MetamaskContext);
  const { eddsaAccount } = useContext(EddsaAccountContext);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const fetchData = async () => {
    setIsLoadingInterval(true);
    let txes;
    if (!eddsaAccount) {
      setIsLoadingInterval(false);
      return;
    }
    setSender(eddsaAccount.zkEthAddr);
    try {
      await axios
        .get(
          `${url}/v1/zkPayment/transactions?fromHezEthereumAddress=${eddsaAccount.zkEthAddr}`
        )
        .then((res) => {
          console.log(res.data.data);
          if (res.data.data != null) {
            setTransactionInfo(res.data.data);
          }
        });
    } catch (e) {
      console.log(e);
    }
    setIsLoadingInterval(false);
  };

  useEffect(() => {
    // Fetch data initially when component mounts
    fetchData();

    // Fetch data at intervals using setInterval
    const intervalId = setInterval(fetchData, 10000); // Fetch every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    async function getAccountInfo() {
      setIsLoading(true);
      let txes;
      if (!eddsaAccount) {
        setIsLoading(false);
        return;
      }
      setSender(eddsaAccount.zkEthAddr);
      try {
        await axios
          .get(
            `${url}/v1/zkPayment/transactions?fromHezEthereumAddress=${eddsaAccount.zkEthAddr}`
          )
          .then((res) => {
            console.log(res.data.data);
            if (res.data.data != null) {
              setTransactionInfo(res.data.data);
            }
          });
      } catch (e) {
        console.log(e);
      }

      setIsLoading(false);
    }
    getAccountInfo();
  }, [eddsaAccount]);
  const mockTxInfo = [
    {
      txHash:
        "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      state: "PENDING",
      type: true,
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      fromEthAddr: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      depositAmount: 0,
      amount: "100000000000000000000000",
      batch: 10,
    },
    {
      txHash:
        "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      state: "PENDING",
      type: true,
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      fromEthAddr: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      depositAmount: 0,
      amount: "100000000000000000000000",
      batch: 10,
    },
    {
      txHash:
        "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      state: "PENDING",
      type: true,
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      fromEthAddr: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      depositAmount: 0,
      amount: "100000000000000000000000",
      batch: 10,
    },
  ];

  return (
    <Box
      display="flex"
      flexDirection="column"
      bgcolor="#FEFAE0"
      sx={{
        borderRadius: "15px",
        paddingX: "4%",
        paddingY: "2%",
      }}
    >
      <Box display="flex" alignItems="center">
        <Box pr={2}>Account: </Box>
        <Button
          sx={{
            textTransform: "none",
            borderRadius: "15px",
            fontFamily: "inherit",
            color: "inherit",
            border: "2px solid #DDA15E",
            width: "500px",
            height: "45px",
          }}
          onClick={handleClick}
        >
          <Box width="95%">{sender}</Box>
          <Box width="5%" display="flex" alignItems="center">
            <KeyboardArrowRightIcon />
          </Box>
        </Button>
        <Popover
          anchorEl={anchorEl}
          sx={{
            ".MuiPopover-paper": {
              borderRadius: "15px",
            },
          }}
          open={Boolean(anchorEl)}
          onClose={handleClosePopOver}
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
              display: "flex",
              justifyContent: "center",
              border: "2px solid #BC6C25",
              bgcolor: "#FEFAE0",
              borderRadius: "15px",
              color: "#000",
              width: "500px",
            }}
          >
            <MenuList>
              {addresses.map(
                (addr) =>
                  addr !== sender && (
                    <MenuItem
                      sx={{
                        fontFamily: "Lexend Exa",
                        fontSize: "15px",
                        fontWeight: "500",
                        paddingY: "0px",
                      }}
                      onClick={() => setSender(addr)}
                    >
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        width="100%"
                      >
                        {addr}
                      </Box>
                    </MenuItem>
                  )
              )}
            </MenuList>
          </Box>
        </Popover>
      </Box>
      <Box color="#000">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                TxHash
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                State
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                Type
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                TxType
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                Sender
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                Receiver
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                L1Amount
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                Token
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                Batch
              </TableCell>
            </TableRow>
          </TableHead>
          {transactionInfo === null ? (
            <></>
          ) : (
            <TableBody>
              {transactionInfo.map((tx) => (
                <TableRow hover>
                  <TableCell
                    align="left"
                    sx={{ color: "#000", fontFamily: "Lexend Exa" }}
                  >
                    {truncateString(tx.txHash, 30)}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.state
                      ? stateTx[tx.state]
                      : tx.l1Batch != 0
                      ? "CONFIRMED"
                      : "PENDING"}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.type ? "L1" : "L2"}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.txType}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.sender != "0x0000000000000000000000000000000000000000"
                      ? truncateString(tx.sender, 20)
                      : truncateString(tx.fromEthAddr, 20)}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {truncateString(tx.receiver, 20)}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.depositAmount
                      ? ethers.utils.formatUnits(tx.depositAmount, 18)
                      : 0}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {ethers.utils.formatUnits(tx.amount, 18).toString()}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tokenEnum[tx.token]}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tx.batch}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <Box pt={2} display="flex" justifyContent="center">
          {" "}
          {isLoading ? (
            <CircularProgress />
          ) : transactionInfo === null ? (
            "No history found"
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default History;
