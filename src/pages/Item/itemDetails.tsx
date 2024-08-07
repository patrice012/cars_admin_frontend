import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import Header from "../../components/Header/Header";
import Item from "../../models/item.model";
import CarItemSlider from "../../components/CarItemSlider";
import AddUpdateItem from "./addUpdateItem";
import { DeleteModal } from "../../components/Modal";

const ItemDetails = () => {
  const location = useLocation();
  const item = location.state;
  return (
    <>
      <Header page={item.title} />
      <div className="searches-container centerer">
        <ItemKeyword item={item} />
      </div>
    </>
  );
};

type ItemKewordProps = {
  item: Item;
};

const ItemKeyword = ({ item }: ItemKewordProps) => {
  const navigate = useNavigate();
  const items = item.photos;
  const itemsLenght = items.length;
  const [isOpen, setIsOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleDeleteData = (state: boolean) => {
    setRemoving(!removing);
    if (state) {
      navigate(-1);
    }
  };

  return (
    <>
      <div className="content-site">
        <div className="flex-1 flex flex-col w-full">
          <div className="flex">
            {item.photos.map((photo, idx) => (
              <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ marginRight: idx != itemsLenght - 1 ? 25 : 0 }}
              >
                <img src={photo} />
              </div>
            ))}
          </div>
          <div className="mt-5">
            <h3 className="text">Car Name: {item.title}</h3>
            <h3>Car Brand: {item.brand.title}</h3>
            <h3>Description: {item.description}</h3>
          </div>
        </div>
        <div className="border-l-2 border-[#e3eaf4] pl-5">
          <div className="flex flex-col gap-10 bg-[#c6d3e5] rounded-lg items-center p-10">
            <div className="wrapper-btn">
              <div className="actions flex items-center justify-start">
                <button
                  onClick={() => setIsUpdating(true)}
                  className="btn btn-info flex items-center justify-center"
                >
                  <RxUpdate color="white" />
                  <span className="text-white"> Update</span>
                </button>
              </div>
            </div>
            <div className="wrapper-btn">
              <div className="actions flex items-center justify-start">
                <button
                  onClick={() => setRemoving(true)}
                  className="btn btn-error flex items-center justify-center"
                >
                  <MdDeleteOutline color="white" />
                  <span className="text-white"> Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CarItemSlider
        items={item.photos}
        isOpen={isOpen}
        toggleModal={() => setIsOpen(!isOpen)}
      />
      <AddUpdateItem
        isOpen={isUpdating}
        toggleModal={() => setIsUpdating(!isUpdating)}
      />
      <DeleteModal
        deleteItem={toggleDeleteData}
        _id={item._id}
        url="item/delete"
        isOpen={removing}
        closeModal={() => setRemoving(!removing)}
      />
    </>
  );
};

export default ItemDetails;
