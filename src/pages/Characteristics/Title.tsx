import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Title() {
  return (
    <>
      <Header page={"Title"} />
      <div className="searches-container centerer">
        <ItemList page={"Title"} />
      </div>
    </>
  );
}
