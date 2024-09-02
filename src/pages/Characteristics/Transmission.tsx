import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Transmission() {
  return (
    <>
      <Header page={"Transmission"} headerStatus={""} />
      <div className="searches-container centerer">
        <ItemList page={"Transmission"} />
      </div>
    </>
  );
}
