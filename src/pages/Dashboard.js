import { Box, Button, CircularProgress, Modal } from "@mui/material";
import Account from "../components/Accounts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateTransactionModal from "../components/modal/CreateTransactionModal";
import CreateDepositModal from "../components/modal/CreateDepositModel";
import CreateWithdrawModal from "../components/modal/CreateWithdrawModel";
import { useContext, useState, useEffect } from "react";
import { MetamaskContext } from "src/Router";
import { getOnChainData } from "src/utils/wallet";
import axios from "axios";

const tokens = ["USDC", "USDT", "WBTC"];
function Dashboard() {
  const [openModal, setOpenModal] = useState(0);
  const { metamask } = useContext(MetamaskContext);
  const [balanceData, setBalanceData] = useState({});
  const [zkAccount, setZkAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewTx = () => {
    setOpenModal(2);
  };
  const handleNewDeposit = () => {
    setOpenModal(1);
  };

  const handleNewWithdraw = () => {
    setOpenModal(3);
  };

  const mockData = [
    {
      nameTag: "UNDEFINED",
      owner: "UNDEFINED",
      bjj: "UNDEFINED",
      balance: {
        USDT: {
          value: 0,
          nonce: 0,
          idx: 0,
        },
        USDC: {
          value: 0,
          nonce: 0,
          idx: 0,
        },
        ETH: {
          value: 0,
          nonce: 0,
          idx: 0,
        },
        WBTC: {
          value: 0,
          nonce: 0,
          idx: 0,
        },
      },
    },
  ];

  useEffect(() => {
    async function getAccountInfo() {
      setIsLoading(true);
      let balances;
      if (metamask == null) {
        balances = await getOnChainData(null, tokens);
      } else {
        balances = await getOnChainData(metamask.ethAddr, tokens);
        await axios
          .get(`http://127.0.0.1:8080/v1/zkPayment/accounts?ethAddr=${metamask.ethAddr}`)
          .then((res) => {
            const data = res.data.data;
            if (data.length == 0) {
              setZkAccount(mockData);
            } else {
              let accounts = {
                nameTag: "ACTIVED",
                owner: data[0].ethAddr,
                bjj: data[0].bjj,
                balance: {
                  USDT: { value: 0, nonce: 0, idx: 0 },
                  USDC: { value: 0, nonce: 0, idx: 0 },
                  ETH: { value: 0, nonce: 0, idx: 0 },
                  WBTC: { value: 0, nonce: 0, idx: 0 },
                },
              };
              for (let i = 0; i < data.length; i++) {
                accounts.balance[data[i].name].value = data[i].balance;
                accounts.balance[data[i].name].nonce = data[i].nonce;
                accounts.balance[data[i].name].idx = data[i].idx;
              }
              setZkAccount([accounts]);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }

      setBalanceData(balances);
      setIsLoading(false);
    }
    getAccountInfo();
  }, [balanceData, metamask]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "15px",
        }}
      >
        <Box display="flex" justifyContent="space-between" width="31%">
          <Button
            sx={{
              bgcolor: "#416CB8",
              padding: "10px",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "inherit",
              color: "inherit",
              "&:hover": {
                bgcolor: "#416CB8",
              },
            }}
            onClick={handleNewDeposit}
          >
            <AddBoxIcon sx={{ marginRight: "5px" }} />
            New Deposit
          </Button>
          <Button
            sx={{
              bgcolor: "#416CB8",
              padding: "10px",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "inherit",
              color: "inherit",
              "&:hover": {
                bgcolor: "#416CB8",
              },
            }}
            onClick={handleNewTx}
          >
            <AddBoxIcon sx={{ marginRight: "5px" }} />
            New Withdraw
          </Button>
          <Button
            sx={{
              bgcolor: "#416CB8",
              padding: "10px",
              borderRadius: "10px",
              textTransform: "none",
              fontFamily: "inherit",
              color: "inherit",
              "&:hover": {
                bgcolor: "#416CB8",
              },
            }}
            onClick={handleNewWithdraw}
          >
            <AddBoxIcon sx={{ marginRight: "5px" }} />
            New Transaction
          </Button>
        </Box>
        <Modal open={openModal} onClose={() => setOpenModal(0)}>
          {openModal === 1 ? (
            <CreateDepositModal balanceData={balanceData} handleClose={() => setOpenModal(0)} />
          ) : openModal === 2 ? (
            <CreateWithdrawModal handleClose={() => setOpenModal(0)} />
          ) : (
            <CreateTransactionModal handleClose={() => setOpenModal(0)} />
          )}
          {/* <CreateTransactionModal handleClose={() => setOpenModal(0)} /> */}
        </Modal>
      </Box>
      {zkAccount == null ? (
        <CircularProgress />
      ) : (
        zkAccount.map((item) => (
          <Account
            nameTag={item.nameTag}
            owner={metamask ? metamask.ethAddr : "undefined"}
            address={metamask ? "0x" + metamask.publicKeyCompressedHex : "undefined"}
            balance={item.balance}
          />
        ))
      )}
    </Box>
  );
}

export default Dashboard;
