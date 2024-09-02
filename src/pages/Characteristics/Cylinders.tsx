import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function Cylinders() {
  return (
    <>
      <Header page={"Cylinders"} headerStatus={""} />
      <div className="searches-container centerer">
        <ItemList page={"Cylinders"} />
      </div>
    </>
  );
}
