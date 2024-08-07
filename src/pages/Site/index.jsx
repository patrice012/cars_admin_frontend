// componenets
import Header from "../../components/Header/Header";

import { SiteData } from "./SiteData";

export default function SitesData() {
  return (
    <>
      <Header page={"Sites data"} />

      <div className="searches-container centerer">
        <SiteData />
      </div>
    </>
  );
}
