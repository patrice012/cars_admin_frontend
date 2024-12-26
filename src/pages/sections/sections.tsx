import { IoMdAddCircle, IoMdColorPalette } from "react-icons/io";
import { MdOutlineTypeSpecimen } from "react-icons/md";

import Header from "../../components/Header/Header";

import { Feature } from "../../components/Characteristics/Features";

export function Sections() {
  return (
    <>
      <Header page={"Sections"} headerStatus={""} />
      <div className="centerer home-container">
        <div className="stats-container-jd">
          <Feature
            name="Selected cars"
            link="selected_cars"
            children={<IoMdColorPalette />}
          />
          <Feature
            name="Query cars"
            link="selected_cars"
            children={<MdOutlineTypeSpecimen />}
          />
        </div>
      </div>
    </>
  );
}
