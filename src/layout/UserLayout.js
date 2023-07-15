// @ts-nocheck
import { Box, Button, MenuItem, MenuList, Popover } from "@mui/material";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useContext, useEffect } from "react";
import * as React from "react";
import { MetamaskContext } from "src/Router";

function UserLayout({ childComponent }) {
  const networks = ["Goerli", "Sepolia"];
  const [network, setNetwork] = useState(networks[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [btnName, setBtnName] = useState(localStorage.getItem("Connect") !== null ? "Connected" : "CONNECT");
  const { metamask, setMetamask } = useContext(MetamaskContext);

  useEffect(() => {
    window.ethereum.on("accountsChanged", handleAccountsList);
  }, []);

  const handleAccountsList = (addressList) => {
    if (addressList.length === 0) return handleDisconnectWallet();
    else return handleConnectWallet();
  };
  const handleAction = () => {
    if (metamask != undefined && metamask != null) {
      console.log("disconnect")
      return handleDisconnectWallet();
    } else {
      console.log("connect")
      return handleConnectWallet();
    }
  };

  function handleConnectWallet() {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_requestAccounts" }).then((res) => {
        setMetamask(res[0]);
        localStorage.setItem("Connect", "metamask");
        setBtnName(res[0]);
      });
    }
  }

  function handleDisconnectWallet() {
    setBtnName("CONNECT");
    setMetamask(null);
    localStorage.removeItem("Connect");
  }

  function truncateString(str, num) {
    if (str.length > num || num <= 7) {
      return str.slice(0, num - 7) + "..." + str.slice(-3);
    } else {
      return str;
    }
  }

  const handleToggle = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  return (
    <Box px={4} pt={1} width="100%" display="flex" flexDirection="column">
      <Box display="flex" justifyContent="flex-end">
        <Box display="flex" justifyContent="center" p={1} mr={2} border="1px solid #FFF" borderRadius="10px">
          <LocalGasStationRoundedIcon /> 0.01$
        </Box>
        <Box>
          <Button
            sx={{
              height: "100%",
              width: "140px",
              border: "2px solid #5C80BC",
              borderRadius: "10px",
              textTransform: "none",
              color: "#FFF",
              paddingX: "10px",
              fontFamily: "inherit",
            }}
            onClick={handleToggle}
          >
            {network}
            <ArrowDropDownIcon />
          </Button>
          <Popover
            anchorEl={anchorEl}
            sx={{
              ".MuiPopover-paper": {
                borderRadius: "10px",
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
                border: "2px solid #5C80BC",
                bgcolor: "#192238",
                borderRadius: "10px",
                color: "#FFF",
                width: "136px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <MenuList>
                {networks.map(
                  (item) =>
                    item !== network && (
                      <MenuItem sx={{ fontFamily: "inherit", fontSize: "15px" }} onClick={() => setNetwork(item)}>
                        {item}
                      </MenuItem>
                    )
                )}
              </MenuList>
            </Box>
          </Popover>
        </Box>
        <Box>
          <Button
            sx={{
              height: "100%",
              width: "140px",
              border: "2px solid #5C80BC",
              borderRadius: "10px",
              textTransform: "none",
              color: "#FFF",
              paddingX: "10px",
              fontFamily: "inherit",
            }}
            onClick={handleAction}
          >
            {btnName != "CONNECT" ? truncateString(btnName, 15) : btnName}
          </Button>
        </Box>
      </Box>

      <Box p={4} borderRadius="15px" bgcolor="#111827" sx={{ marginTop: "100px" }}>
        {childComponent}
      </Box>
    </Box>
  );
}

export default UserLayout;
