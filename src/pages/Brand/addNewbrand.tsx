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
  const [data, setData] = useState<{ title: string; image: File[] }>({
    title: "",
    image: [],
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
      setData({ ...data, image: files });
    } else {
      notif("Only one file could be upload");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.title || !(data.image.length > 0)) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("image", data.image[0]);
      const response = await postReq({
        data: formData,
        url: "brand/create",
        extras,
        isFileUpload: true,
      });
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
    setData({ title: "", image: [] });
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
        <FileUpload
          id="photos"
          label="Upload photos"
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
