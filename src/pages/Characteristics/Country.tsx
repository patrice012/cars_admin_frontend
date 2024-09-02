import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Country() {
  return (
    <>
      <Header page={"Countries"} />
      <div className="searches-container centerer">
        <ItemList page={"Countries"} />
      </div>
    </>
  );
}
