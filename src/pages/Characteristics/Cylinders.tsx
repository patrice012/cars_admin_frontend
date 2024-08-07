import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Cylinders() {
  return (
    <>
      <Header page={"Cylinders"} />
      <div className="searches-container centerer">
        <ItemList page={"Cylinders"} />
      </div>
    </>
  );
}
