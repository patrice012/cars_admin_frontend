import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import { useSession } from "../../contexts/authContext";
import Brand from "../../models/brand.model";

interface UpdateBrandProps {
  brand: Brand;
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const UpdateBrand: React.FC<UpdateBrandProps> = ({
  isOpen,
  toggleModal,
  brand,
}) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState({
    name: brand.name,
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

    if (!data.name) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      const response = await postReq({
        data: { ...data, _id: brand._id },
        url: "brand/update",
        extras,
      });
      if (response.status == 200) {
        notif(response.data?.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(response.data?.message ?? "Failed to add data");
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
    setData({ name: "", description: "" });
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

UpdateBrand.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UpdateBrand;
