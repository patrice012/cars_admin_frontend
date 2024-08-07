import { useState } from "react";
import Header from "../../components/Header/Header";
import SiteKeyword from "./SiteKeyword";
import { useLocation } from "react-router-dom";

export default function SiteDetails() {
  const location = useLocation();
  const info = location.state;
  const [headerStatus, setHeaderStatus] = useState("");

  // console.log(info);
  return (
    <>
      <Header page={info.name} headerStatus={headerStatus} />
      <div className="searches-container centerer">
        <SiteKeyword
          siteId={location.state._id}
          setHeaderStatus={setHeaderStatus}
        />
      </div>
    </>
  );
}
