import Header from "../../components/Header/Header";
import { BrandList } from "./brandList";

export default function BrandData() {
  return (
    <>
      <Header page={"Brands"} />

      <div className="searches-container centerer">
        <BrandList />
      </div>
    </>
  );
}
