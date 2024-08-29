import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./styles/tailwind.css";
import "./styles/index.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Auth/Login";
import NotFound from "./pages/404/NotFound";
import Home from "./pages/Home/Home";
import Logout from "./pages/Auth/Logout";
import Account from "./pages/Account/Account";
import AccountList from "./pages/Account/ListOfAccounts";
import ChangePassword from "./pages/Account/ChangePassword";
import { UploadFiles } from "./components/Upload/UploadFiles";
import { Characteristics } from "./pages/Characteristics/Index";
import { UploadFilesProvider } from "./contexts/UploadFilesContext";
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
import { useSession } from "./contexts/authContext";
import CreateNewAccount from "./pages/Account/CreateNewAccount";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NoConnection from "./pages/404/NoConnection";

const App = () => {
  const { isOnline } = useNetworkStatus();
  const { session, checkConnection, isLoading } = useSession();
  const client = new QueryClient();

  // hide sidebar on mobile
  window.addEventListener("resize", toggleMobileView);
  useEffect(toggleMobileView, []);

  useEffect(() => {
    checkConnection();
  }, [session]);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (!session) {
    return (
      <>
        <div className="notif"></div>
        <Login />
      </>
    );
  }

  return (
    <>
      {isOnline ? (
        <QueryClientProvider client={client}>
          <div className="main-container">
            <div className="notif"></div>
            <UploadFilesProvider>
              <Sidebar />
              <div className="main">
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/auth" element={<Login />} />
                  <Route path="/account" element={<Account />}>
                    <Route
                      path="/account/new-account"
                      element={<CreateNewAccount />}
                    />
                    <Route
                      path="/account/list-of-accounts"
                      element={<AccountList />}
                    />
                  </Route>
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/auth/logout" element={<Logout />} />
                  <Route path="/items" element={<CarItemsData />} />
                  <Route path="/items/:id" element={<ItemDetails />} />

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

                  <Route
                    path="/characteristics/brands"
                    element={<BrandData />}
                  />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <UploadFiles />
            </UploadFilesProvider>
          </div>
        </QueryClientProvider>
      ) : (
        <NoConnection />
      )}
    </>
  );
};

export default App;