// componenets
import Header from "../../components/Header/Header";

import { DataList } from "./DataList";

export default function ProxyData() {
  return (
    <>
      <Header page={"Proxy data"} />

      <div className="searches-container centerer">
        <DataList />
      </div>
    </>
  );
}
