import Header from "../../components/Header/Header";
import { ItemList } from "./itemList";

// import { SiteData } from "./SiteData";

export default function CarItemsData() {
  return (
    <>
      <Header page={"Car Items"} headerStatus={""} />

      <div className="searches-container centerer">
        <ItemList />
      </div>
    </>
  );
}
