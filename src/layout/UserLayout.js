// @ts-nocheck
import { Box, Button, MenuItem, MenuList, Popover } from "@mui/material";
import LocalGasStationRoundedIcon from "@mui/icons-material/LocalGasStationRounded";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState, useContext, useEffect } from "react";
import * as React from "react";
import {
  AccountContext,
  MetamaskContext,
  EddsaContext,
  EddsaAccountContext,
} from "src/Router";
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
  const { eddsa } = useContext(EddsaContext);
  const { eddsaAccount, setEddsaAccount } = useContext(EddsaAccountContext);

  // const [account, setaccount] = useState('0x0');
  useEffect(() => {
    if (!window.ethereum) {
      // Nothing to do here... no ethereum provider found
      return;
    }
    const accountWasChanged = (accounts) => {
      // const account = generatepublicandprivatekeystringfrommnemonic(
      //   mnemonic,
      //   accounts[0]
      // );
      setMetamask(accounts[0]);
      setBtnName(accounts[0]);
    };
    const getAndSetAccount = async () => {
      const changedAccounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = changedAccounts[0];
      setMetamask(account);
      setBtnName(account);
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
  const handleAction = async () => {
    if (
      metamask != null
      // localStorage.getItem("Connect") != undefined
    ) {
      console.log("Disconnect");
      await handleDisconnectWallet();
    } else {
      console.log("Connect");
      await handleConnectWallet();
    }
  };

  async function handleConnectWallet() {
    if (window.ethereum) {
      const res = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // const account = generatePublicAndPrivateKeyStringFromMnemonic(
      //   mnemonic,
      //   res[0]
      // );
      setMetamask(res[0]);
      setBtnName(res[0]);
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
        <Box>
          <Button
            sx={{
              height: "100%",
              width: "140px",
              border: "2px solid #bc6c25",
              bgcolor: "#FEFAE0",
              borderRadius: "10px",
              textTransform: "none",
              color: "#000",
              paddingX: "10px",
              fontFamily: "inherit",
            }}
            onClick={handleToggle}
          >
            {truncateString("0x" + eddsaAccount.publicKeyCompressedHex, 15)}
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
                border: "2px solid #bc6c25",
                bgcolor: "#FEFAE0",
                borderRadius: "10px",
                color: "#000",
                width: "136px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <MenuList>
                {eddsa.map(
                  (item) =>
                    item !== network && (
                      <MenuItem
                        sx={{ fontFamily: "inherit", fontSize: "15px" }}
                        onClick={() => setEddsaAccount(item)}
                      >
                        {truncateString("0x" + item.publicKeyCompressedHex, 15)}
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
              border: "2px solid #bc6c25",
              bgcolor: "#FEFAE0",
              borderRadius: "10px",
              textTransform: "none",
              color: "#000",
              paddingX: "10px",
              fontFamily: "inherit",
            }}
            onClick={async () => await handleAction()}
          >
            {metamask ? truncateString(btnName, 15) : "CONNECT"}
          </Button>
        </Box>
      </Box>

      <Box
        p={4}
        borderRadius="15px"
        bgcolor="#dda15e"
        sx={{ marginTop: "100px" }}
      >
        {childComponent}
      </Box>
    </Box>
  );
}

export default UserLayout;
