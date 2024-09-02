import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function City() {
  return (
    <>
      <Header page={"City"} />
      <div className="searches-container centerer">
        <ItemList page={"City"} />
      </div>
    </>
  );
}
