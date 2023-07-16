// @ts-nocheck
import { Box, Button, MenuItem, MenuList, Popover } from "@mui/material";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useContext, useEffect } from "react";
import * as React from "react";
import { AccountContext, MetamaskContext } from "src/Router";
import { generatePublicAndPrivateKeyStringFromMnemonic } from "src/utils/wallet";

import { useNavigate } from "react-router-dom";

function UserLayout({ childComponent }) {
  const networks = ["Goerli", "Sepolia"];
  const navigate = useNavigate();
  const [network, setNetwork] = useState(networks[0]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [btnName, setBtnName] = useState("CONNECT");
  const { metamask, setMetamask } = useContext(MetamaskContext);
  const { mnemonic } = useContext(AccountContext);

  // const [account, setaccount] = useState('0x0');
  useEffect(() => {
    if (!window.ethereum) {
      // Nothing to do here... no ethereum provider found
      return;
    }
    const accountWasChanged = (accounts) => {
      const account = generatePublicAndPrivateKeyStringFromMnemonic(mnemonic, accounts[0]);
      setMetamask(account);
      setBtnName(account.ethAddr)
      console.log("accountWasChanged");
    };
    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const account = generatePublicAndPrivateKeyStringFromMnemonic(mnemonic, changedAccounts[0]);
      setMetamask(account);
      setBtnName(account.ethAddr)
      console.log("getAndSetAccount");
    };
    const clearAccount = () => {
      setMetamask({});
      console.log("clearAccount");
    };
    window.ethereum.on("accountsChanged", accountWasChanged);
    window.ethereum.on("connect", getAndSetAccount);
    window.ethereum.on("disconnect", clearAccount);
    window.ethereum.request({ method: "eth_requestAccounts" }).then(
      (accounts) => {
        console.log("accounts", accounts);
        // No need to set account here, it will be set by the event listener
      },
      (error) => {
        // Handle any UI for errors here, e.g. network error, rejected request, etc.
        // Set state as needed
      }
    );
    return () => {
      // Return function of a non-async useEffect will clean up on component leaving screen, or from re-reneder to due dependency change
      window.ethereum.removeListener("accountsChanged", accountWasChanged);
      window.ethereum.removeListener("connect", getAndSetAccount);
      window.ethereum.removeListener("disconnect", clearAccount);
    };
  }, []);

  // useEffect(() => {
  //   window.ethereum.on("accountsChanged", handleAccountsList);
  // }, []);

  // const handleAccountsList = (addressList) => {
  //   if (addressList.length === 0) return handleDisconnectWallet();
  //   else return handleConnectWallet();
  // };
  const handleAction = () => {
    if (
      metamask != null
      // localStorage.getItem("Connect") != undefined
    ) {
      console.log("Disconnect");
      return handleDisconnectWallet();
    } else {
      console.log("Connect");
      return handleConnectWallet();
    }
  };

  async function handleConnectWallet() {
    if (window.ethereum) {
      const res = await window.ethereum.request({ method: "eth_requestAccounts" });

      const account = generatePublicAndPrivateKeyStringFromMnemonic(mnemonic, res[0]);
      setMetamask(account);
      setBtnName(account.ethAddr);
      navigate("/dashboard");
    }
  }

  async function handleDisconnectWallet() {
    setBtnName("CONNECT");
    setMetamask(null);
    // localStorage.removeItem("Connect");
    navigate("/portfolio");
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
            {metamask ? truncateString(btnName, 15) : "CONNECT"}
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
