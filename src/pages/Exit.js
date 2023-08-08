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
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";
import { MetamaskContext, EddsaAccountContext } from "src/Router";
import { ethers } from "ethers";
import { url, addresses as addrs, rpcProviders } from "src/common/globalCfg";
import ZKPAYMENTABI from "../common/abis/zkpayment.json";
// import { tokenMap } from "src/utils/constant";
import { stateTx, tokenEnum } from "src/utils/constant";
import { signWithdraw } from "src/utils/permit";
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

function Exit() {
  const [accountInfo, setAccountInfo] = useState([]);
  const [exitData, setExitData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sender, setSender] = useState(addresses[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTx, setIsLoadingTx] = useState(false);
  const [ethPrice, setETHPrice] = useState(0);
  const { metamask } = useContext(MetamaskContext);
  const { eddsaAccount } = useContext(EddsaAccountContext);

  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  async function handleExit(exit) {
    setIsLoadingTx(true);
    const arbitrumProvider = rpcProviders.arbitrum;
    const zkpayment = new ethers.Contract(
      addrs.arbitrum.zkpaymentAddress,
      ZKPAYMENTABI,
      arbitrumProvider
    );
    const signers = new ethers.Wallet(
      eddsaAccount.privateKey,
      arbitrumProvider
    );
    const signature = await signWithdraw(
      signers,
      "0x" + eddsaAccount.publicKeyCompressedHex,
      metamask,
      zkpayment.address
    );

    const txData = await zkpayment.populateTransaction
      .withdrawMerkleProof(
        exit.tokenID,
        exit.amount,
        // "0x" + exit.bjj,
        "0x" + eddsaAccount.publicKeyCompressedHex.toString(),
        exit.numExitRoot,
        exit.siblings,
        exit.idx,
        exit.instantWithdraw,
        signature
      )
      .then((tx) => tx.data);

    const params = [
      {
        from: metamask,
        to: addrs.arbitrum.zkpaymentAddress,
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
    setIsLoadingTx(false);
  }

  useEffect(() => {
    async function getExitData() {
      setIsLoading(true);
      if (eddsaAccount == null) {
        setIsLoading(false);
        navigate("/getting-started");
      }
      try {
        await axios
          .get(`${url}/v1/zkPayment/exit?ethAddr=${eddsaAccount.zkEthAddr}`)
          .then((res) => {
            if (res.data.data != null) {
              setExitData(res.data.data);
            }
          });
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    }
    getExitData();
  }, [eddsaAccount]);

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
      <Box color="#000">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                ID
              </TableCell>
              <TableCell
                align="left"
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                ETHEREUM ADDRESS
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                AMOUNT
              </TableCell>
              <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                TOKEN
              </TableCell>
              <TableCell
                colSpan={2}
                sx={{ color: "#000", fontFamily: "Lexend Exa" }}
              >
                NUM EXIT ROOT
              </TableCell>
            </TableRow>
          </TableHead>
          {exitData === null ? (
            <></>
          ) : (
            <TableBody>
              {exitData.map((row) => (
                <TableRow hover>
                  <TableCell
                    align="left"
                    sx={{ color: "#000", fontFamily: "Lexend Exa" }}
                  >
                    {row.idx}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {truncateString(eddsaAccount.zkEthAddr, 20)}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {ethers.utils.formatUnits(row.amount, 18).toString()}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {tokenEnum[row.tokenID]}
                  </TableCell>
                  <TableCell sx={{ color: "#000", fontFamily: "Lexend Exa" }}>
                    {row.numExitRoot}
                  </TableCell>
                  <TableCell
                    colSpan={2}
                    sx={{ color: "#000", fontFamily: "Lexend Exa" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={async () => await handleExit(row)}
                    >
                      {isLoadingTx ? <CircularProgress /> : "Exit"}
                    </Button>
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
          ) : exitData === null ? (
            "No exit found"
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Exit;
