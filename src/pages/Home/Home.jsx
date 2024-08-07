import { Link } from "react-router-dom";

// components
import Header from "../../components/Header/Header";
import Auth from "../../components/Auth/Auth";

import { RiRobot2Line } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsPersonWorkspace } from "react-icons/bs";

// helpers
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";

// react query
import { useQuery } from "react-query";

// loading effect
import { AnalyticsLoadingSkeleton } from "./LoadingEffect";

const Home = () => {
  // get analytics
  const handleAnalyticsLoading = async (e) => {
    // send req
    return await postReq({ home: "home" }, "/api/analytics");
  };

  const {
    data: analyticsData,
    isLoading,
    isError,
  } = useQuery(["analytics"], handleAnalyticsLoading, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  return (
    <>
      <Auth />
      <Header page={"Home"} />
      {/* home */}
      <div className="centerer home-container">
        {/* remove this line */}
        <div className="stats-container-jd">
          {isError && notif("error", "Failed to fetch data")}
          <div className="stat-jd">
            <span>
              Admins accounts:{" "}
              {isLoading ? (
                <AnalyticsLoadingSkeleton />
              ) : (
                analyticsData?.analytic?.totalAdminsAccounts
              )}
            </span>
            <AiOutlineUser />
          </div>
          <div className="stat-jd">
            <span>
              Sites :{" "}
              {isLoading ? (
                <AnalyticsLoadingSkeleton />
              ) : (
                analyticsData?.analytic?.totalSites
              )}
            </span>
            <HiOutlineUserGroup />
          </div>
          <div className="stat-jd">
            <span>
              Proxy :{" "}
              {isLoading ? (
                <AnalyticsLoadingSkeleton />
              ) : (
                analyticsData?.analytic?.totalProxies
              )}
            </span>
            <BsPersonWorkspace />
          </div>
        </div>

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
