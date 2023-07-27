import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import GettingStarted from "./pages/GettingStarted";
import WalletRecovery from "./pages/WalletRecovery";
import Footer from "./components/Footer";
import UserLayout from "./layout/UserLayout";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";
import Setting from "./pages/Setting";
import Exit from "./pages/Exit";
import { createContext, useState } from "react";

export const AccountContext = createContext(null);
export const MetamaskContext = createContext(null);

function Router() {
  const [mnemonic, setMnemonic] = useState(null);
  const [metamask, setMetamask] = useState(null);
  return (
    <BrowserRouter>
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        p={2}
      >
        <AccountContext.Provider value={{ mnemonic, setMnemonic }}>
          <MetamaskContext.Provider value={{ metamask, setMetamask }}>
            <Box>
              <Sidebar />
            </Box>
            <Routes>
              <Route path="/getting-started" element={<GettingStarted />} />
              <Route path="/wallet-recovery" element={<WalletRecovery />} />
              <Route
                path="/dashboard"
                element={<UserLayout childComponent={<Dashboard />} />}
              />
              <Route
                path="/portfolio"
                element={<UserLayout childComponent={<Portfolio />} />}
              />
              <Route
                path="/history"
                element={<UserLayout childComponent={<History />} />}
              />
              <Route
                path="/setting"
                element={<UserLayout childComponent={<Setting />} />}
              />
              <Route
                path="/exit"
                element={<UserLayout childComponent={<Exit />} />}
              />
            </Routes>
          </MetamaskContext.Provider>
        </AccountContext.Provider>
      </Box>
    </BrowserRouter>
  );
}

export default Router;
