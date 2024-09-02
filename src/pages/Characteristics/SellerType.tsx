import Header from "../../components/Header/Header";
import { ItemList } from "../../components/Characteristics/FeaturesPages/ItemsList";

export default function SellerType() {
  return (
    <>
      <Header page={"Seller Type"} headerStatus={""} />
      <div className="searches-container centerer">
        <ItemList page={"SellerType"} />
      </div>
    </>
  );
}
