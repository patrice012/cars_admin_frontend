import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

import { RiRobot2Line } from "react-icons/ri";

const Home = () => {
  return (
    <>
      <Header page={"Home"} />
      {/* home */}
      <div className="centerer home-container">
        {/* quick links */}
        <h3 className="quick-link-title">Quick Links</h3>
        <div className="quick-links stats-container-jd">
          <Link to="/sites">
            <div className="stat-jd">
              <div>
                <p>Manage Your Sites</p>
                <p className="desc">
                  View all your sites, tweak their settings.
                </p>
              </div>
              <RiRobot2Line />
            </div>
          </Link>

          <Link to="/proxies">
            <div className="stat-jd">
              <div>
                <p>Manage Your Proxy</p>
                <p className="desc">
                  View all your proxy, tweak their settings.
                </p>
              </div>
              <RiRobot2Line />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
