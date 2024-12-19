import Header from "../../components/Header/Header";
import { ItemList } from "./SelectedList";

// import { SiteData } from "./SiteData";

export default function SelectedCars() {
  return (
    <>
      <Header page={"Selected Cars List"} headerStatus={""} />

      <div className="searches-container centerer">
        <ItemList />
      </div>
    </>
  );
}
