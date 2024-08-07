import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// icons
import { BsPlusLg } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegStopCircle } from "react-icons/fa";
import { VscDebugStart } from "react-icons/vsc";
import { MdOutlineDelete } from "react-icons/md";

import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
// import { DeleteSite } from "./DeleteSite";
// import { CreateNewKwargs } from "./AddNewKwargs";
// import { UpdateSite } from "./UpdateSite";
// import { SectionLoadingSkeleton } from "./Loading";
// import Error from "./ReqError";
import notif from "../../helpers/notif";
import Header from "../../components/Header/Header";
import Item from "../../models/item.model";
import CarItemSlider from "../../components/CarItemSlider";

const ItemDetails = () => {
  const location = useLocation();
  const item = location.state;
  const [headerStatus, setHeaderStatus] = useState("");

  // console.log(info);
  return (
    <>
      <Header page={item.title} headerStatus={headerStatus} />
      <div className="searches-container centerer">
        <ItemKeyword item={item} setHeaderStatus={setHeaderStatus} />
      </div>
    </>
  );
};

type ItemKewordProps = {
  item: Item;
  setHeaderStatus: React.Dispatch<React.SetStateAction<string>>;
};

const ItemKeyword = ({ item, setHeaderStatus }: ItemKewordProps) => {
  const [removing, setRemoving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionData, setActionData] = useState({});
  const location = useLocation();

  const [siteData, setSiteData] = useState({});
  const [status, setStatus] = useState("");

  useEffect(() => {
    setHeaderStatus(status);
  }, [status]);

  const [refechSite, setRefechSite] = useState(true);

  // delete row data
  const handleDeleteSite = (id: string) => {
    // get detail data
    setActionData({ _id: id });
    // open modal
    setRemoving(true);
  };

  const [visit, setVisite] = useState();
  const [click, setClick] = useState();

  return (
    <>
      <div className="content-site">
        <h3 className="text">Car Name: {item.title}</h3>
        <h3>Car Brand: {item.brand.title}</h3>
        <h3>Description: {item.description}</h3>
      </div>
      <div className="flex">
        {item.photos.map((photo) => (
          <div>
            <img className="w-10" src={photo} />
          </div>
        ))}
      </div>
      <CarItemSlider isOpen={true} toggleModal={() => {}} />
    </>
  );
};

export default ItemDetails;
