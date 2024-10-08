import { IoMdAddCircle, IoMdColorPalette } from "react-icons/io";
import { MdOutlineTypeSpecimen } from "react-icons/md";
import { MdEmojiTransportation } from "react-icons/md";
import { PiCylinderDuotone } from "react-icons/pi";
import { BsFuelPump } from "react-icons/bs";
import { IoLogoModelS } from "react-icons/io";
import { FaCity } from "react-icons/fa";
import { MdOutlineTitle } from "react-icons/md";
import { FaSellsy } from "react-icons/fa";

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
          <Feature
            hasRelation
            relationName="Select Brand"
            relationUri="brand"
            name="Model"
            link="model"
            children={<IoLogoModelS />}
          />
          {/* <Feature
            name="Cylinders"
            link="cylinders"
            children={<PiCylinderDuotone />}
          />  */}
          <Feature
            name="Transmission"
            link="transmission"
            children={<MdEmojiTransportation />}
          />
          <Feature name="Fuel" link="fuel" children={<BsFuelPump />} />

          <Feature name="Brand" link="brands" children={<IoMdAddCircle />} />
          <Feature name="Title" link="title" children={<MdOutlineTitle />} />
          <Feature name="Seller Type" link="seller_type" children={<FaSellsy />} />
          <Feature name="Country" hasRelation={false} link="country" children={<FaCity />} />
          <Feature hasRelation={true}  relationName="Select Country" relationUri="country" name="City" link="city" children={<FaCity />} />
        </div>
      </div>
    </>
  );
}
