import { Box, Button, Modal } from "@mui/material";
import Account from "../components/Accounts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateTransactionModal from "../components/modal/CreateTransactionModal";
import { useState } from "react";

function Dashboard() {
  const [openModal, setOpenModal] = useState(false);
  const handleNewTx = () => {
    setOpenModal(true);
  };

  const mockData = [
    {
      nameTag: "Account #1",
      owner: "0x242ed78bf0fe7672ff01ae6de558e45b3749f197",
      address: "0xcB714F263cBc742A79745faf2B2c47367460D26A",
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
      address: "0x990b82dc8ab6134f482d2cad3bba11c537cd7b45",
      balance: {
        USDT: 200000,
        USDC: 500000,
        ETH: 20,
        WBTC: 10,
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
          New Transaction
        </Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <CreateTransactionModal handleClose={() => setOpenModal(false)} />
        </Modal>
      </Box>

      {mockData.map((item) => (
        <Account
          nameTag={item.nameTag}
          owner={item.owner}
          address={item.address}
          balance={item.balance}
        />
      ))}
    </Box>
  );
}

export default Dashboard;
