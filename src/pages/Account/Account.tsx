import { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import UserContext from "../../contexts/UserContext";
import { AiOutlineSetting } from "react-icons/ai";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineLogout } from "react-icons/hi";
import { Outlet } from "react-router-dom";

const Account = () => {
  const location = useLocation();
  const { login, changeLogin } = useContext(UserContext);

  useEffect(() => {
    console.log(login);
  }, []);

  return (
    <>
      <Header page={"Account"} headerStatus={""} />
      <div className="centerer account-container">
        {/* your account  */}
        {location.pathname === "/account" && (
          <div className="account">
            <div className="quick-links stats-container-jd account-quick-links">
              <Link to="/change-password">
                <div className="stat-jd">
                  <div>
                    <p>Reset Password</p>
                    <p className="desc">Change your password</p>
                  </div>
                  <AiOutlineSetting />
                </div>
              </Link>
              <Link to="/account/list-of-accounts">
                <div className="stat-jd">
                  <div>
                    <p>Accounts</p>
                    <p className="desc">List of dashboard users</p>
                  </div>
                  <AiOutlineUser />
                </div>
              </Link>
              <Link to="/auth/logout">
                <div className="stat-jd">
                  <div>
                    <p>Logout</p>
                    <p className="desc">Logout from your current session</p>
                  </div>
                  <HiOutlineLogout />
                </div>
              </Link>
            </div>

            <div className="account-details">
              {/* {login && ( */}
              <ul>
                <li>
                  <span>Name:</span> {login?.username || "Jonh"}
                </li>
                <li>
                  <span>Email:</span> {login?.email || "doe@gmail.com"}
                </li>
                <li>
                  <span>Role:</span> admin
                </li>
                <li>
                  <span>Registration Date:</span>{" "}
                  {new Date(login?.user?.date).toLocaleString() || "01/01/2023"}
                </li>
              </ul>
              {/* )} */}
            </div>
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default Account;
