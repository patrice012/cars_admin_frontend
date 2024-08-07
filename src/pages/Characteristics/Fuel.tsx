import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Fuel() {
  return (
    <>
      <Header page={"Fuel"} />
      <div className="searches-container centerer">
        <ItemList page={"Fuel"} />
      </div>
    </>
  );
}
