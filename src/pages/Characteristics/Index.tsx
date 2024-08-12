import { IoMdAddCircle, IoMdColorPalette } from "react-icons/io";
import { MdOutlineTypeSpecimen } from "react-icons/md";
import { MdEmojiTransportation } from "react-icons/md";
import { PiCylinderDuotone } from "react-icons/pi";
import { TbUserStar } from "react-icons/tb";
import { BsFuelPump } from "react-icons/bs";

import Header from "../../components/Header/Header";

import { Feature } from "../../components/Characteristics/Features";

export function Characteristics() {
  return (
    <>
      <Header page={"Characteristics"} headerStatus={""} />
      <div className="centerer home-container">
        <div className="stats-container-jd">
          <Feature
            name="Colors"
            link="colors"
            children={<IoMdColorPalette />}
          />
          <Feature
            name="Engine type"
            link="engine_type"
            children={<MdOutlineTypeSpecimen />}
          />
          <Feature name="Drive" link="drive" children={<TbUserStar />} />
          <Feature
            name="Cylinders"
            link="cylinders"
            children={<PiCylinderDuotone />}
          />
          <Feature
            name="Transmission"
            link="transmission"
            children={<MdEmojiTransportation />}
          />
          <Feature name="Fuel" link="fuel" children={<BsFuelPump />} />

          <Feature name="Brand" link="brands" children={<IoMdAddCircle />} />
        </div>
      </div>
    </>
  );
}
