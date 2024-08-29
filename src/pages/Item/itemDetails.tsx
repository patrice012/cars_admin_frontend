import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import Header from "../../components/Header/Header";
import Item from "../../models/item.model";
import CarItemSlider from "../../components/CarItemSlider";
import { DeleteModal } from "../../components/Modal";
import UpdateItem from "./updateItem";
import { useQuery } from "react-query";
import postReq from "../../helpers/postReq";
import { useSession } from "../../contexts/authContext";

const ItemDetails = () => {
  const location = useLocation();
  const item = location.state;
  return (
    <>
      <Header page={item.title} headerStatus={""} />
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
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const navigate = useNavigate();
  const items = item.photos;
  const itemsLenght = items.length;
  const [isOpen, setIsOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getItem = async () => {
    const result = await postReq({
      data: { _id: item._id },
      url: `item/withid`,
    });
    if (result.status == 200) return result.data;
  };

  let queryKey = [location.pathname];
  const {
    data: itemDetails,
    isLoading: isLoading,
    error,
    refetch: refetchDetails,
  } = useQuery(queryKey, getItem, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  console.log(itemDetails);
  console.log(item);

  const toggleDeleteData = (state: boolean) => {
    setRemoving(!removing);
    if (state) {
      navigate(-1);
    }
  };

  return (
    <>
      {!isLoading && !error && itemDetails && (
        <>
          <div className="content-site">
            <div className="flex-1 flex flex-col w-full">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 13,
                }}
                // className="flex flex-wrap"
              >
                {itemDetails.photos.map((photo: string, idx: number) => (
                  <div
                    key={photo}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                      marginRight: idx != itemsLenght - 1 ? 20 : 0,
                      width: 240,
                    }}
                  >
                    <img style={{ width: 240 }} src={photo} />
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <h3 className="text">Car Name: {itemDetails.title}</h3>
                <div className="flex items-center">
                  <h3>Car Brand: {itemDetails.brand.title}</h3>
                  <img
                    className="mr-4"
                    width={30}
                    src={itemDetails.brand.image}
                  />
                </div>
                <h3>Description: {itemDetails.description}</h3>
              </div>
            </div>
            <div className="flex flex-col gap-10 rounded-lg items-center p-10">
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
          {isOpen && (
            <CarItemSlider
              items={itemDetails.photos}
              isOpen={isOpen}
              toggleModal={() => setIsOpen(!isOpen)}
            />
          )}
          {isUpdating && itemDetails && (
            <UpdateItem
              item={itemDetails as Item}
              isOpen={isUpdating}
              toggleModal={() => {
                setIsUpdating(!isUpdating);
                refetchDetails();
              }}
            />
          )}
          {removing && (
            <DeleteModal
              deleteItem={toggleDeleteData}
              _id={itemDetails._id}
              url="item/delete"
              isOpen={removing}
              closeModal={() => setRemoving(!removing)}
            />
          )}
        </>
      )}
    </>
  );
};

export default ItemDetails;
