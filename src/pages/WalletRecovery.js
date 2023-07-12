import { Box, Button, Paper } from "@mui/material";

function WalletRecovery() {
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
        <Box fontSize="20px" fontWeight="600" pb={3}>
          Import your wallet
        </Box>
        <Box pb={3}>Continue your journey by import your wallet.</Box>
        <Box width="70%">
          <Button
            sx={{
              borderRadius: "25px",
              border: "2px solid #FFF",
              padding: "10px",
              paddingX: "24px",
              margin: 0,
              textTransform: "none",
              fontFamily: "inherit",
              color: "#FFF",
              width: "100%",
            }}
          >
            Import Wallet
          </Button>
        </Box>
        <Box
          children={<Paper />}
          my={5}
          sx={{
            background: "#FFF",
            height: "2px",
            width: "500px",
          }}
        />
        <Box fontSize="20px" fontWeight="600" pb={3}>
          Recover your secret
        </Box>
        <Box pb={3}>
          Recover your lost secret by combining shares from your guardians.
        </Box>
        <Box width="70%" pt={2}>
          <Button
            sx={{
              borderRadius: "25px",
              border: "2px solid #FFF",
              padding: "10px",
              paddingX: "24px",
              margin: 0,
              textTransform: "none",
              fontFamily: "inherit",
              color: "#FFF",
              width: "100%",
            }}
          >
            Combine shares
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default WalletRecovery;
