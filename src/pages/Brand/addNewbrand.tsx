import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import TextAreaField from "../../components/TextAreaField";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PropTypes from "prop-types";

interface AddNewBrandProps {
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const AddNewBrand: React.FC<AddNewBrandProps> = ({ isOpen, toggleModal }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.title) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      const res = await postReq(data, "brand/create");
      console.log(res);
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
    setData({ title: "", description: "" });
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
          label="Title"
          id="title"
          type="text"
          placeholder="Enter title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        {/* <TextAreaField
          label="Add description"
          id="description"
          placeholder="Enter description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        /> */}
        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddNewBrand.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddNewBrand;
