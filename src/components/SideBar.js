import { Drawer, Box, List, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AccountContext, MetamaskContext } from "../Router";

function Sidebar() {
  const { mnemonic } = useContext(AccountContext);
  const { metamask } = useContext(MetamaskContext);
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const defaultRoutes = [
    {
      name: "Getting Started",
      route: "/getting-started",
    },
    {
      name: "Wallet Recovery",
      route: "/wallet-recovery",
    },
  ];

  const connectedRoutes = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
    {
      name: "History",
      route: "/history",
    },
    {
      name: "Exit",
      route: "/exit",
    },
  ];

  const loggedRoutes = [
  ];

  return (
    <>
      <Drawer
        ModalProps={{ keepMounted: true }}
        anchor="left"
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        open
        variant="permanent"
        sx={{
          width: {
            xs: "268px",
            xsm: "110px",
            md: "110px",
            lg: "300px",
          },
          minHeight: "100vh",
          "& .MuiDrawer-paper": {
            width: {
              xs: "268px",
              xsm: "110px",
              md: "110px",
              lg: "300px",
            },
            backgroundColor: "#DDA15E",
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <Box
          sx={{
            fontSize: "25px",
            fontWeight: "600",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            py: 3,
            paddingBottom: "15vh",
            color: "#000",
          }}
        >
          ZKPayment
        </Box>

        <List>
          {mnemonic !== null
            ? metamask === null
              ? loggedRoutes.map((item) => (
                  <Box>
                    <Button
                      disableTouchRipple
                      onClick={() => navigate(item.route)}
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "18px",
                        textTransform: "none",
                        width: "100%",
                        paddingBottom: "10px",
                        color: `${location.pathname === item.route ? "#606C38" : "#000"}`,
                        borderRight: `
                         4px
                       solid  ${location.pathname === item.route ? "#f2c57c" : "transparent"}`,
                        borderRadius: "0px",
                      }}
                    >
                      {item.name}
                    </Button>
                  </Box>
                ))
              : connectedRoutes.map((item) => (
                  <Box>
                    <Button
                      disableTouchRipple
                      onClick={() => navigate(item.route)}
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "18px",
                        textTransform: "none",
                        width: "100%",
                        paddingBottom: "10px",
                        color: `${location.pathname === item.route ? "#606C38" : "#000"}`,
                        borderRight: `
                         4px
                       solid  ${location.pathname === item.route ? "#f2c57c" : "transparent"}`,
                        borderRadius: "0px",
                      }}
                    >
                      {item.name}
                    </Button>
                  </Box>
                ))
            : defaultRoutes.map((item) => (
                <Box display="flex" justifyContent="center">
                  <Button
                    disableTouchRipple
                    disableRipple
                    onClick={() => navigate(item.route)}
                    sx={{
                      fontFamily: "inherit",
                      fontSize: "18px",
                      textTransform: "none",
                      width: "100%",
                      paddingBottom: "10px",
                      color: `${location.pathname === item.route ? "#606C38" : "#000"}`,
                      borderRight: `
                         4px
                       solid  ${location.pathname === item.route ? "#f2c57c" : "transparent"}`,
                      borderRadius: "0px",
                    }}
                  >
                    {item.name}
                  </Button>
                </Box>
              ))}
        </List>
      </Drawer>
    </>
  );
}

export default Sidebar;
