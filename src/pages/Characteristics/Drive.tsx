import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Drive() {
  return (
    <>
      <Header page={"Drive"} />
      <div className="searches-container centerer">
        <ItemList page={"Drive"} />
      </div>
    </>
  );
}
