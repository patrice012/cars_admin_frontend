import { useState } from "react";

import Modal from "../../Modal";
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";
import InputField from "../../InputField";
import Button from "../../Button";

import PropTypes from "prop-types";

interface UpdateDataProps {
  isOpen: boolean;
  page: string;
  updatedData: any;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const UpdateData: React.FC<UpdateDataProps> = ({
  isOpen,
  toggleModal,
  page,
  updatedData,
}) => {
  const [data, setData] = useState({
    name: "",
    _id: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    data["_id"] = updatedData["_id"];

    if (!data.name) {
      setWarning("Please fill all fields");
      return;
    }

    if (!data["_id"]) {
      setWarning("Can't update item");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      let uri = "";
      if (page?.toLowerCase() === "colors") {
        uri = "colors/update";
      } else if (page?.toLowerCase() === "cylinders") {
        uri = "cylinders/update";
      } else if (page?.toLowerCase() === "enginetype") {
        uri = "engine_type/update";
      } else if (page?.toLowerCase() === "drive") {
        uri = "drive/update";
      } else if (page?.toLowerCase() === "transmission") {
        uri = "transmission/update";
      } else if (page?.toLowerCase() === "fuel") {
        uri = "fuel/update";
      }
      console.log(data, page, uri);

      const res = await postReq(data, uri);
      if (res) {
        notif(res?.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(res?.message ?? "Failed to add data");
        setActionBtn({ text: "Save", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      console.log(error);
      setActionBtn({ text: "Save", isDisabled: false });
    }
  };

  const closeModal = (state: boolean) => {
    setWarning("");
    setData({ name: "", _id: "" });
    toggleModal({ state: state, action: "update" });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add New Item"
      warning={warning}
      closeModal={() => closeModal(false)}
    >
      <form onSubmit={handleSubmit}>
        <InputField
          label="name"
          id="name"
          type="text"
          placeholder="Enter name"
          value={data.name || updatedData.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

UpdateData.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UpdateData;
