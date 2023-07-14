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
import { useEffect, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ethers } from "ethers";

const addresses = ["0xcB714F263cBc742A79745faf2B2c47367460D26A", "0x990b82dc8ab6134f482d2cad3bba11c537cd7b45"];

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
  const [ethPrice, setETHPrice] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    async function getAccountInfo() {
      setIsLoading(true);
      await axios.get(`https://api.aascan.org/api/v1/account?chain_id=5&address=${sender}&type=sender`).then((res) => {
        console.log(res.data.data.list);
        if (res.data.data != null) {
          setAccountInfo(res.data.data.list);
        }
      });
      await axios
        .get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD", {
          headers: {
            Authorization: "Bearer 3575f756f525440d5f62336c9670798c11d4ed854663c2956c17b5fb19209c42",
          },
        })
        .then((res) => setETHPrice(res.data.USD));
      setIsLoading(false);
    }
    getAccountInfo();
  }, [sender]);
  const mockTxInfo = [
    {
      txHash: "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      status: "PENDING",
      type: "L1TX",
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      amount: "100000000000000000000000",
      batch: 10,
    },
    {
      txHash: "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      status: "PENDING",
      type: "L1TX",
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      amount: "100000000000000000000000",
      batch: 10,
    },
    {
      txHash: "0x598aac439a1271e44bf8a3a50a00e66298560a73ad7bc1bf0faa59d8875b0fe5",
      status: "PENDING",
      type: "L1TX",
      txType: "Deposit",
      sender: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      receiver: "0xc8b6496af2c93f47485bcda9b3ffe5bde1a0d178",
      token: "USDC",
      amount: "100000000000000000000000",
      batch: 10,
    },
  ];

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" alignItems="center">
        <Box pr={2}>Sender: </Box>
        <Button
          sx={{
            textTransform: "none",
            borderRadius: "15px",
            fontFamily: "inherit",
            color: "inherit",
            border: "2px solid #5C80BC",
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
              border: "2px solid #5C80BC",
              bgcolor: "#192238",
              borderRadius: "15px",
              color: "#FFF",
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
                      <Box display="flex" justifyContent="flex-start" width="100%">
                        {addr}
                      </Box>
                    </MenuItem>
                  )
              )}
            </MenuList>
          </Box>
        </Popover>
      </Box>
      <Box color="#FFF">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>
                TxHash
              </TableCell>
              <TableCell align="left" sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>
                Status
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}
              >
                Type
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}
              >
                TxType
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}
              >
                Sender
              </TableCell>
              <TableCell
                // align="left"
                sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}
              >
                Receiver
              </TableCell>
              <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>Amount</TableCell>
              <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>Token</TableCell>
              <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>Batch</TableCell>
            </TableRow>
          </TableHead>
          {accountInfo === null ? (
            <></>
          ) : (
            <TableBody>
              {mockTxInfo.map((tx) => (
                <TableRow hover>
                  <TableCell align="left" sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>
                    {truncateString(tx.txHash, 30)}
                  </TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{tx.status}</TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{tx.type}</TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{tx.txType}</TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>
                    {truncateString(tx.sender, 20)}
                  </TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>
                    {truncateString(tx.receiver, 20)}
                  </TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{ethers.utils.formatUnits(tx.amount, 18)}</TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{tx.token}</TableCell>
                  <TableCell sx={{ color: "#FFF", fontFamily: "Lexend Exa" }}>{tx.batch}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        <Box pt={2} display="flex" justifyContent="center">
          {" "}
          {isLoading ? <CircularProgress /> : accountInfo === null ? "No history found" : <></>}
        </Box>
      </Box>
    </Box>
  );
}

export default History;
