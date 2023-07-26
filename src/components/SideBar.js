import { Drawer, Box, List, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AccountContext } from "../Router";

function Sidebar() {
  const { mnemonic } = useContext(AccountContext);
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

  const loggedRoutes = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
    {
      name: "Portfolio",
      route: "/portfolio",
    },
    {
      name: "History",
      route: "/history",
    },
    {
      name: "Setting",
      route: "/setting",
    },
    {
      name: "Exit",
      route: "/exit",
    },
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
            backgroundColor: "#111827",
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
            color: "#FFF",
          }}
        >
          ChainGuard
        </Box>

        <List>
          {mnemonic !== null
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
                      color: `${
                        location.pathname === item.route ? "#70BDD6" : "#FFF"
                      }`,
                      borderRight: `
                         4px
                       solid  ${
                         location.pathname === item.route
                           ? "#009DDC"
                           : "transparent"
                       }`,
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
                      color: `${
                        location.pathname === item.route ? "#70BDD6" : "#FFF"
                      }`,
                      borderRight: `
                         4px
                       solid  ${
                         location.pathname === item.route
                           ? "#70BDD6"
                           : "transparent"
                       }`,
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
