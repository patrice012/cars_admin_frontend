import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function ColorsData() {
  return (
    <>
      <Header page={"Colors"} headerStatus={""} />
      <div className="searches-container centerer">
        <ItemList page={"Colors"} />
      </div>
    </>
  );
}
