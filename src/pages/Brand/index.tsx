import Header from "../../components/Header/Header";
import { BrandList } from "./brandList";

export default function BrandData() {
  return (
    <>
      <Header page={"Brands"} headerStatus={""} />

      <div className="searches-container centerer">
        <BrandList />
      </div>
    </>
  );
}
