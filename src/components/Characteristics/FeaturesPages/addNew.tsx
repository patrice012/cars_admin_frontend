import { useState } from "react";

import Modal from "../../Modal";
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";
import InputField from "../../InputField";
import Button from "../../Button";

import PropTypes from "prop-types";
import { useSession } from "../../../contexts/authContext";

interface AddNewProps {
  isOpen: boolean;
  page: string;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const AddNew: React.FC<AddNewProps> = ({ isOpen, toggleModal, page }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState({
    name: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.name) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      let url = "";
      if (page?.toLowerCase() === "colors") {
        url = "colors/create";
      } else if (page?.toLowerCase() === "cylinders") {
        url = "cylinders/create";
      } else if (page?.toLowerCase() === "enginetype") {
        url = "engine_type/create";
      } else if (page?.toLowerCase() === "model") {
        url = "model/create";
      } else if (page?.toLowerCase() === "transmission") {
        url = "transmission/create";
      } else if (page?.toLowerCase() === "fuel") {
        url = "fuel_type/create";
      }

      const response = await postReq({ data, url, extras });
      if (response.status == 201) {
        notif(response?.data.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(response?.data.message ?? "Failed to add data");
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
    setData({ name: "" });
    toggleModal({ state: state, action: "create" });
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
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddNew.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddNew;
