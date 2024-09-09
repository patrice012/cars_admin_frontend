import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

import { RiRobot2Line, RiSettingsLine } from "react-icons/ri";
import { IoCarSport } from "react-icons/io5";
import { IoMdPeople } from "react-icons/io";

const Home = () => {
  return (
    <>
      <Header page={"Home"} />
      {/* home */}
      <div className="centerer home-container">
        {/* quick links */}
        <h3 className="quick-link-title">Quick Links</h3>
        <div className="quick-links stats-container-jd">
          <Link to="/items">
            <div className="stat-jd" style={{ width:350}}>
              <div>
                <p>Manage Your Car</p>
                <p className="desc">View all your cars</p>
              </div>
              <IoCarSport />
            </div>
          </Link>

          <Link to="/characteristics">
            <div className="stat-jd" style={{ width:350}}>
              <div>
                <p>Manage Your characteristics</p>
                <p className="desc">View all your characteristics </p>
              </div>
              <RiSettingsLine />
            </div>
          </Link>

          <Link to="/sellers">
            <div className="stat-jd " style={{ width:350}}>
              <div>
                <p>Manage Your sellers</p>
                <p className="desc">View all your sellers </p>
              </div>
              <IoMdPeople />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
