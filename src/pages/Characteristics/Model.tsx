import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Model() {
  return (
    <>
      <Header page={"Model"} headerStatus={""} />
      <div className="searches-container centerer">
        <ItemList page={"Model"} />
      </div>
    </>
  );
}
