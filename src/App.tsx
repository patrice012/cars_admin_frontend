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
import CarItemsData from "./pages/cars";
import ItemDetails from "./pages/cars/carDetails";
import ColorsData from "./pages/Characteristics/Colors";
import Cylinders from "./pages/Characteristics/Cylinders";
import Model from "./pages/Characteristics/Model";
import EngineType from "./pages/Characteristics/EngineType";
import Fuel from "./pages/Characteristics/Fuel";
import Country from "./pages/Characteristics/Country";
import Title from "./pages/Characteristics/Title";
import City from "./pages/Characteristics/City";
import SellerType from "./pages/Characteristics/SellerType";
import Transmission from "./pages/Characteristics/Transmission";
import { useSession } from "./contexts/authContext";
import CreateNewAccount from "./pages/Account/CreateNewAccount";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NoConnection from "./pages/404/NoConnection";
import { SellerList } from "./pages/sellers/sellerList";
import { SubmittedCars } from "./pages/cars/submittedCars";
import SubmittedCarDetails from "./pages/cars/submittedCarDetails";
import { Sections } from "./pages/sections/sections";
import SelectedCars from "./pages/sections/SelectedCars";
import { ChooseCar } from "./pages/sections/chooseCar";
import Choose from "./pages/sections/Choose";

const App = () => {
  const { isOnline } = useNetworkStatus();
  const { session, checkConnection, isLoading } = useSession();
  const client = new QueryClient();

  // hide sidebar on mobile
  window.addEventListener("resize", toggleMobileView);
  useEffect(toggleMobileView, []);

  

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
                  <Route path="/submitted_cars" element={<SubmittedCars />} />
                  <Route
                    path="/submitted_cars/:id"
                    element={<SubmittedCarDetails />}
                  />
                  <Route path="/sellers" element={<SellerList />} />

                  <Route
                    path="/characteristics"
                    element={<Characteristics />}
                  />
                  <Route path="/sections" element={<Sections/>} />
                  <Route path="/section/choose_cars" element={<Choose/>} />
                  <Route path="/sections/selected_cars" element={<SelectedCars/>} />
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
                  <Route path="/characteristics/model" element={<Model />} />
                  <Route
                    path="/characteristics/country"
                    element={<Country />}
                  />
                  <Route path="/characteristics/city" element={<City />} />
                  <Route
                    path="/characteristics/transmission"
                    element={<Transmission />}
                  />
                  <Route path="/characteristics/title" element={<Title />} />
                  <Route path="/characteristics/fuel" element={<Fuel />} />
                  <Route
                    path="/characteristics/seller_type"
                    element={<SellerType />}
                  />

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
