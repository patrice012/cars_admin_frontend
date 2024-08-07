import { Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/index.min.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Auth/Login/Login";
import NotFound from "./pages/404/NotFound";
import Home from "./pages/Home/Home";
import Logout from "./pages/Auth/Logout/Logout";
import Account from "./pages/Account/Account";
import AccountList from "./pages/Account/ListOfAccounts";
import ChangePassword from "./pages/Account/ChangePassword";
import ProxyData from "./pages/Proxy/ProxyData";
import { UploadFiles } from "./components/Upload/UploadFiles";
import SitesData from "./pages/Site";
import SiteDetails from "./pages/Site/SiteDetails";
import CreateNewAccount from "./pages/Account/CreateNew/CreateNewAccount";
import { Characteristics } from "./pages/Characteristics/Index";
import { UserProvider } from "./contexts/UserContext";
import { UploadFilesProvider } from "./contexts/UploadFilesContext";
import { useEffect } from "react";
import { toggleMobileView } from "./helpers/toggleMobileView";
import BrandData from "./pages/Brand";
import CarItemsData from "./pages/Item";
import ItemDetails from "./pages/Item/itemDetails";
import ColorsData from "./pages/Characteristics/Colors";
import Cylinders from "./pages/Characteristics/Cylinders";
import Drive from "./pages/Characteristics/Drive";
import EngineType from "./pages/Characteristics/EngineType";
import Fuel from "./pages/Characteristics/Fuel";
import Transmission from "./pages/Characteristics/Transmission";

const App = () => {
  // react query
  const client = new QueryClient();

  // hide sidebar on mobile
  window.addEventListener("resize", toggleMobileView);
  useEffect(toggleMobileView, []);

  return (
    <>
      <QueryClientProvider client={client}>
        <>
          {/* component code */}
          <div className="main-container">
            <div className="notif"></div>

            <UserProvider>
              <UploadFilesProvider>
                <Sidebar />
                <div className="main">
                  <Routes>
                    <Route path="/" exact element={<Login />} />

                    <Route path="/home" element={<Home />} />
                    <Route exact path="/account" element={<Account />}>
                      <Route
                        path="/account/new-account"
                        element={<CreateNewAccount />}
                      />
                      <Route
                        path="/account/list-of-accounts"
                        element={<AccountList />}
                      />
                    </Route>
                    <Route
                      path="/change-password"
                      element={<ChangePassword />}
                    />
                    <Route path="/auth/logout" element={<Logout />} />
                    <Route path="/proxies" element={<ProxyData />} />
                    <Route path="/sites" element={<SitesData />} />
                    <Route path="/sites/:id" element={<SiteDetails />} />
                    <Route path="/items" element={<CarItemsData />} />
                    <Route path="/items/:id" element={<ItemDetails />} />
                    <Route path="/brands" element={<BrandData />} />

                    <Route
                      path="/characteristics"
                      element={<Characteristics />}
                    />
                    <Route
                      path="/characteristics/colors"
                      element={<ColorsData />}
                    />
                    <Route
                      path="/characteristics/cylinders"
                      element={<Cylinders />}
                    />
                    <Route
                      path="/characteristics/engine_type"
                      element={<EngineType />}
                    />
                    <Route path="/characteristics/drive" element={<Drive />} />
                    <Route
                      path="/characteristics/transmission"
                      element={<Transmission />}
                    />
                    <Route path="/characteristics/fuel" element={<Fuel />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <UploadFiles />
              </UploadFilesProvider>
            </UserProvider>
          </div>
        </>
      </QueryClientProvider>
    </>
  );
};

export default App;
