import { Box, Button, Input, InputAdornment, Paper, Collapse } from "@mui/material";
import _sodium from "libsodium-wrappers";
import { pbkdf2Sync } from "pbkdf2";
import { useState, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { AccountContext, MetamaskContext } from "../Router";
import ImportWallet from "../components/ImportWallet";

export const ImportWalletContext = createContext(null);

function WalletRecovery() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loginPassword, setLoginPassword] = useState("");
  const { setMnemonic } = useContext(AccountContext);
  const { metamask } = useContext(MetamaskContext);

  function handleLogin(password) {
    const nonce = Buffer.from(Object.values(JSON.parse(window.localStorage.getItem("encryption_nonce"))));
    console.log("nonce: ", nonce);
    const keyHash = pbkdf2Sync(password, "salt", 256, 32, "sha512");
    const encrypted = Buffer.from(Object.values(JSON.parse(window.localStorage.getItem("mnemonic"))));

    if (encrypted == null) {
      alert("no account found");
    } else {
      console.log(encrypted);
      const decrypted = new TextDecoder().decode(_sodium.crypto_secretbox_open_easy(encrypted, nonce, keyHash));
      console.log(decrypted);
      setMnemonic(decrypted);
      if (metamask != null) {
        navigate("/dashboard");
      } else {
        navigate("/portfolio");
      }
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "40%",
        }}
      >
        <Collapse in={currentStep == 0}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box fontSize="20px" fontWeight="600" pb={3}>
              Import your wallet
            </Box>
            <Box>Continue your journey by import your wallet.</Box>
            <Box width="70%" pt={3}>
              <Button
                sx={{
                  borderRadius: "25px",
                  border: "2px solid #000",
                  padding: "10px",
                  paddingX: "24px",
                  margin: 0,
                  textTransform: "none",
                  fontFamily: "inherit",
                  color: "#000",
                  width: "100%",
                }}
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                }}
              >
                Import Wallet
              </Button>
            </Box>
          </Box>
        </Collapse>
        <ImportWalletContext.Provider value={{ currentStep, setCurrentStep }}>
          <ImportWallet />
        </ImportWalletContext.Provider>
      </Box>
    </>
  );
}

export default WalletRecovery;
