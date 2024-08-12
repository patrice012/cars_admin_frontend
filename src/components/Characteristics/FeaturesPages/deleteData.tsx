import { useState } from "react";

import Modal from "../../Modal";
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";

import PropTypes from "prop-types";

interface DeletedDataProps {
  isOpen: boolean;
  page: string;
  deleteData: any;

  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const DeletedData: React.FC<DeletedDataProps> = ({
  isOpen,
  toggleModal,
  page,
  deleteData,
}) => {
  const [actionBtn, setActionBtn] = useState({
    text: "Delete",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleRemove = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!deleteData["_id"]) {
      setWarning("Can't update item");
      return;
    }

    setActionBtn({ text: "Deleting...", isDisabled: true });

    try {
      let uri = "";
      if (page?.toLowerCase() === "colors") {
        uri = "colors/delete";
      } else if (page?.toLowerCase() === "cylinders") {
        uri = "cylinders/delete";
      } else if (page?.toLowerCase() === "enginetype") {
        uri = "engine_type/delete";
      } else if (page?.toLowerCase() === "drive") {
        uri = "drive/delete";
      } else if (page?.toLowerCase() === "transmission") {
        uri = "transmission/delete";
      } else if (page?.toLowerCase() === "fuel") {
        uri = "fuel/delete";
      }

      const response = await postReq({ data: deleteData, url: uri });
      if (response.status == 200) {
        notif(response?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Delete", isDisabled: false });
        closeModal(true);
      } else {
        notif(response?.data.message ?? "Failed to delete data");
        setActionBtn({ text: "Delete", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      console.log(error);
      setActionBtn({ text: "Delete", isDisabled: false });
    }
  };

  const closeModal = (state: boolean) => {
    setWarning("");
    toggleModal({ state: state, action: "delete" });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete  Item"
      warning={warning}
      closeModal={() => closeModal(false)}
    >
      <div className=" flex items-center gap-8">
        <button
          onClick={() => closeModal(false)}
          className="btn btn--action  flex items-center justify-center gap-2"
        >
          <span>Cancel</span>
        </button>

        <button
          onClick={handleRemove}
          style={{ background: "red", color: "#FFF" }}
          className="btn flex items-center justify-center gap-2"
        >
          <span>{actionBtn.text}</span>
        </button>
      </div>
    </Modal>
  );
};

DeletedData.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default DeletedData;
