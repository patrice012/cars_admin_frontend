import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Item from "../../models/item.model";
import CarItemSlider from "../../components/CarItemSlider";
import { DeleteModal, DisableModal } from "../../components/Modal";
import UpdateItem from "./updateCar";
import { useQuery } from "react-query";
import postReq from "../../helpers/postReq";
import { useSession } from "../../contexts/authContext";
import { CloseCircle, Edit, Trash } from "iconsax-react";

const ItemDetails = () => {
  const location = useLocation();
  const item = location.state;
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const navigate = useNavigate();
  const items = item.imagesUrls;
  const itemsLenght = items.length;
  const [isOpen, setIsOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getItem = async () => {
    const result = await postReq({
      data: { _id: item._id },
      url: `car/get`,
    });
    if (result.status == 200) return result.data;
  };

  let queryKey = [location.pathname];
  const {
    data: itemDetails,
    isLoading: isLoading,
    isSuccess: isSuccess,
    error,
    refetch: refetchDetails,
  } = useQuery(queryKey, getItem, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const toggleDeleteData = (state: boolean) => {
    setRemoving(!removing);
    if (state) {
      navigate(-1);
    }
  };

  const actions = (
    <div className="flex gap-4 my-2 justify-end">
      <button
        style={{ background: "#ca8a04" }}
        onClick={() => setDeactivating(true)}
        className="btn border-0 btn-square"
      >
        <CloseCircle color="white" />
      </button>
      <button
        style={{ background: "#2563eb" }}
        onClick={() => setIsUpdating(true)}
        className="btn border-0 btn-square"
      >
        <Edit color="white" />
      </button>
      <button
        style={{ background: "red" }}
        onClick={() => setRemoving(true)}
        className="btn border-0 btn-square"
      >
        <Trash color="white" />
      </button>
    </div>
  );

  return (
    <>
      <Header actions={actions} page={item.name} headerStatus={""} />
      <div className="flex w-full gap-6 mt-6">
        <div className="w-[50%] grid grid-cols-2 gap-4">
          {isSuccess &&
            itemDetails.imagesUrls.map((photo: string, idx: number) => (
              <div
                className="cursor-pointer"
                key={photo}
                onClick={() => setIsOpen(!isOpen)}
              >
                <img src={photo} />
              </div>
            ))}
        </div>
        <div className="w-[45%] px-3">
          {isSuccess && itemDetails && (
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Values</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Car Brand</td>
                  <td>{itemDetails.brandId.name}</td>
                </tr>

                <tr>
                  <td>Car Name:</td>
                  <td>{itemDetails.name}</td>
                </tr>
                <tr>
                  <td>Brand:</td>
                  <td>
                    <div className="flex items-center">
                      <img
                        className="mr-4"
                        width={30}
                        src={itemDetails.brandId.logo}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>Model:</td>
                  <td>{itemDetails.modelId.name}</td>
                </tr>
                <tr>
                  <td>Seller:</td>
                  <td>{itemDetails.sellerId.firstname}</td>
                </tr>
                <tr>
                  <td>Note:</td>
                  <td>{itemDetails.note}</td>
                </tr>
                <tr>
                  <td>Sales price:</td>
                  <td>{itemDetails.salesPrice}</td>
                </tr>
                <tr>
                  <td>Min price:</td>
                  <td>{itemDetails.minPrice}</td>
                </tr>
                <tr>
                  <td>Color car:</td>
                  <td>{itemDetails.colorId.name}</td>
                </tr>
                <tr>
                  <td>Odometer:</td>
                  <td>{itemDetails.odometer}</td>
                </tr>
                <tr>
                  <td>Cylinders:</td>
                  <td>{itemDetails.cylinders}</td>
                </tr>
                <tr>
                  <td>Year:</td>
                  <td>{itemDetails.year}</td>
                </tr>
                <tr>
                  <td>Title:</td>
                  <td>{itemDetails.titleId.name}</td>
                </tr>
                <tr>
                  <td>Fuel type:</td>
                  <td>{itemDetails.fuelTypeId.name}</td>
                </tr>
                <tr>
                  <td>Engine type:</td>
                  <td>{itemDetails.engineTypeId.name}</td>
                </tr>
                <tr>
                  <td>Transmission:</td>
                  <td>{itemDetails.transmissionId.name}</td>
                </tr>
                <tr>
                  <td>City:</td>
                  <td>{itemDetails.cityId.name}</td>
                </tr>
                <tr>
                  <td>IsHybrid:</td>
                  <td>{itemDetails.isHybrid ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>IsElectric:</td>
                  <td>{itemDetails.isElectric ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        {isOpen && (
          <CarItemSlider
            items={itemDetails.imagesUrls}
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
            _id={item._id}
            url="car/delete"
            isOpen={removing}
            closeModal={() => setRemoving(!removing)}
          />
        )}

        {deactivating && (
          <DisableModal
            data={{ ...itemDetails, isActive: false }}
            deleteItem={toggleDeleteData}
            _id={item._id}
            url="car/update"
            isOpen={deactivating}
            closeModal={() => setDeactivating(!deactivating)}
          />
        )}
      </div>
    </>
  );
};

export default ItemDetails;
