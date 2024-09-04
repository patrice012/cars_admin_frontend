import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import { useSession } from "../../contexts/authContext";
import FileUpload from "../../components/FileUpload";

interface AddNewBrandProps {
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const AddNewBrand: React.FC<AddNewBrandProps> = ({ isOpen, toggleModal }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState<{ name: string; logo: File[] }>({
    name: "",
    logo: [],
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files && files.length == 1) {
      const files = Array.from(e.target.files || []);
      setData({ ...data, logo: files });
    } else {
      notif("Only one file could be upload");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    console.log(data)
    e.preventDefault();
    e.stopPropagation();

    if (!data.name || !(data.logo.length > 0)) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("logo", data.logo[0]);
      
      const response = await postReq({
        data: formData,
        url: "brand/create",
        extras,
        isFileUpload: true,
      });
      console.log(response);
      
      if (response.status == 201) {
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
    setData({ name: "", logo: [] });
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
          label="Brand name"
          id="name"
          type="text"
          placeholder="Enter name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <FileUpload
          id="photos"
          label="Brand logo"
          onChange={handleFileChange}
        />
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
