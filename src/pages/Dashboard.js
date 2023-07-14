import { Box, Button, Modal } from "@mui/material";
import Account from "../components/Accounts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateTransactionModal from "../components/modal/CreateTransactionModal";
import CreateDepositModal from "../components/modal/CreateDepositModel";
import CreateWithdrawModal from "../components/modal/CreateWithdrawModel";
import { useState } from "react";

function Dashboard() {
  const [openModal, setOpenModal] = useState(0);
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
      nameTag: "Account #1",
      owner: "0x242ed78bf0fe7672ff01ae6de558e45b3749f197",
      bjj: "0xcB714F263cBc742A79745faf2B2c47367460D26A",
      balance: {
        USDT: 500000,
        USDC: 200000,
        ETH: 50,
        WBTC: 20,
      },
    },
  ];
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
          {openModal === 1?<CreateDepositModal handleClose={() => setOpenModal(0)} />:openModal===2?<CreateWithdrawModal handleClose={() => setOpenModal(0)} />:<CreateTransactionModal handleClose={() => setOpenModal(0)} />}
          {/* <CreateTransactionModal handleClose={() => setOpenModal(0)} /> */}
        </Modal>
      </Box>

      {mockData.map((item) => (
        <Account nameTag={item.nameTag} owner={item.owner} address={item.bjj} balance={item.balance} />
      ))}
    </Box>
  );
}

export default Dashboard;
