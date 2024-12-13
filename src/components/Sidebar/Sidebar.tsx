import { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";

// icons
import { AiOutlineHome } from "react-icons/ai";
("react-icons/tb");
import { IoMdPeople, IoMdSettings } from "react-icons/io";
import { IoCarSport } from "react-icons/io5";
import { RiSettingsLine } from "react-icons/ri";

import { HiOutlineLogout } from "react-icons/hi";
import { BsBoxArrowLeft } from "react-icons/bs";

//helper
import { closeSideBar } from "../../helpers/toggleMobileView";

// context
import UserContext from "../../contexts/UserContext";
import SidebarItem from "../SidebarItem";
import { Archive, Car } from "iconsax-react";

const Sidebar = () => {
  // loaction
  const location = useLocation();

  // current user
  const { login } = useContext(UserContext);

  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (location.pathname === "/auth" || location.pathname.includes("/404")) {
      setAllowed(false);
    } else {
      setAllowed(true);
    }
  }, [location.pathname]);

  return (
    <>
      {allowed && (
        <>
          <div className="sidebar">
            {/* heading */}
            <div className="heading">
              <Link to={"/"}>ADMIN</Link>
              <button onClick={closeSideBar} className="btn close-sidebar">
                <BsBoxArrowLeft />
              </button>
            </div>

            {/* menu elements */}
            <ul className="menu-container">
              {/* login user box */}
              <Link to={"/account"}>
                <li className="user-box">
                  <div className="user-img">
                    <img src="/img/default-user.png" alt="user image" />
                  </div>
                  <div className="user-details">
                    <h3 className="truncate max-w-[170px]">
                      {login?.username || login?.email}
                    </h3>
                    <p>Admin</p>
                  </div>
                </li>
              </Link>

              <SidebarItem
                title="Dashboard"
                link="/"
                children={<AiOutlineHome />}
              />

              <SidebarItem
                title="Cars"
                link="/items"
                children={<IoCarSport />}
              />

              <SidebarItem
                title="Submitted Cars"
                link="/submitted_cars"
                children={<Archive variant="Bold" size={18} />}
              />

              <SidebarItem
                title="Sellers"
                link="/sellers"
                children={<IoMdPeople />}
              />

              <SidebarItem
                title="Characteristics"
                link="/characteristics"
                children={<RiSettingsLine />}
              />

              <SidebarItem
                title="Settings"
                link="/account"
                children={<IoMdSettings />}
              />

              <SidebarItem
                title="Logout"
                link="/auth/logout"
                children={<HiOutlineLogout />}
              />
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
