import Header from "../../components/Header/Header";
import { ChooseCar } from "./chooseCar";

// import { SiteData } from "./SiteData";

export default function Choose() {
  return (
    <>
      <Header page={"Select Cars"} headerStatus={""} />

      <div className="searches-container centerer">
        <ChooseCar/>
      </div>
    </>
  );
}
