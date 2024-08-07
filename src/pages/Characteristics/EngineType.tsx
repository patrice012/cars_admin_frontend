import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function EngineType() {
  return (
    <>
      <Header page={"Engine Type"} />
      <div className="searches-container centerer">
        <ItemList page={"EngineType"} />
      </div>
    </>
  );
}
