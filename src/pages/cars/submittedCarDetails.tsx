import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Item from "../../models/item.model";
import CarItemSlider from "../../components/CarItemSlider";
import { DeleteModal, DisableModal } from "../../components/Modal";
import UpdateItem from "./updateCar";
import { useQuery } from "react-query";
import postReq from "../../helpers/postReq";
import {
  CloseCircle,
  DocumentDownload,
  Edit,
  Send2,
  TickCircle,
  Trash,
} from "iconsax-react";
import SendToallModal from "./sendModal";

const SubmittedCarDetails = () => {
  const location = useLocation();
  const item = location.state;
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sendToall, setSendToall] = useState(false);

  const getItem = async () => {
    const result = await postReq({
      data: { _id: item._id },
      url: `submitted_car/get`,
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

  const downloadImages = async (imageUrls: string[]) => {
    for (const url of imageUrls) {
      try {
        // Fetch the image
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch image from ${url}`);
        }

        // Convert the image to a Blob
        const blob = await response.blob();

        // Create a temporary anchor element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = url.split("/").pop() || "downloaded-image";
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary URL and remove the link element
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      } catch (error) {
        console.error(`Error downloading image from ${url}:`, error);
      }
    }
  };

  const actions = (
    <div className="flex gap-4 my-2 justify-end">
      <button
        style={{ background: "blue" }}
        onClick={() => downloadImages(itemDetails?.imagesUrls)}
        className="btn border-0 btn-square"
      >
        <DocumentDownload color="white" />
      </button>
      <button
        style={{ background: "#28a745" }}
        onClick={() => setSendToall(true)}
        className="btn border-0 btn-square bg-successs"
      >
        <Send2 color="white" />
      </button>
      <button
        style={{ background: "#ca8a04" }}
        onClick={() => setDeactivating(true)}
        className="btn border-0 btn-square"
      >
        {itemDetails && itemDetails.isActive ? (
          <CloseCircle color="white" />
        ) : (
          <TickCircle color="white" />
        )}
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
      <div className="flex w-full items-start gap-6 mt-6">
        <div className="w-[50%] flex flex-wrap gap-4">
          {isSuccess &&
            itemDetails?.imagesUrls.map((photo: string, idx: number) => (
              <div
                className="w-[240px] h-[140px] cursor-pointer border"
                key={photo}
                onClick={() => setIsOpen(!isOpen)}
              >
                <img className="w-[100%] h-[100%] object-cover" src={photo} />
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
                  <td>{itemDetails?.brand}</td>
                </tr>
                <tr>
                  <td>Car Name:</td>
                  <td>{itemDetails?.name}</td>
                </tr>
                <tr>
                  <td>Min price:</td>
                  <td>{itemDetails?.minPrice}</td>
                </tr>
                <tr>
                  <td>Note:</td>
                  <td>{itemDetails?.note}</td>
                </tr>
                <tr>
                  <td>Car condition</td>
                  <td>{`${
                    item?.condition == "older" ? "Used car" : "New car"
                  }`}</td>
                </tr>
                <tr>
                  <td>User phone</td>
                  <td>{`+${itemDetails?.user?.phone}`}</td>
                </tr>
                <tr>
                  <td>Publish date</td>
                  <td>
                    {itemDetails.createdAt
                      ? new Date(itemDetails?.createdAt!).toLocaleString()
                      : "Not defined"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        {isOpen && (
          <CarItemSlider
            items={itemDetails?.imagesUrls ?? []}
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
            _id={item?._id}
            url="submitted_car/delete"
            isOpen={removing}
            closeModal={() => setRemoving(!removing)}
          />
        )}

        {deactivating && (
          <DisableModal
            data={{ ...itemDetails, isActive: !itemDetails.isActive }}
            deleteItem={toggleDeleteData}
            _id={item?._id}
            url="car/update-field"
            isOpen={deactivating}
            closeModal={() => setDeactivating(!deactivating)}
          />
        )}

        {sendToall && (
          <SendToallModal
            _id={item?._id}
            isOpen={sendToall}
            closeModal={() => setSendToall(!sendToall)}
          />
        )}
      </div>
    </>
  );
};

export default SubmittedCarDetails;
