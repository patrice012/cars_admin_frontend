import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import TextAreaField from "../../components/TextAreaField";
import InputField from "../../components/InputField";
import FileUpload from "../../components/FileUpload";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import Selectable from "../../components/Selectable";
import { useQuery } from "react-query";
import Brand from "../../models/brand.model";
import Item from "../../models/item.model";

interface AddUpdateItemProps {
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const AddUpdateItem: React.FC<AddUpdateItemProps> = ({
  isOpen,
  toggleModal,
}) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    brand: "",
    photos: [],
    videos: [],
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const getBrands = async () => {
    return await postReq({}, "brand");
  };

  const {
    data: brands,
    isLoading: loading,
    error,
    refetch: getPaginate,
  } = useQuery(["queryKey"], getBrands, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = Array.from(e.target.files || []);
    setData((prevData) => ({
      ...prevData,
      [type]: files,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data.title || !data.description || !data.brand) {
      setWarning("Please fill all fields");
      return;
    }
    setActionBtn({ text: "Saving...", isDisabled: true });
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("brand", data.brand);
      for (let i = 0; i < data.photos.length; i++) {
        formData.append("photos", data.photos[i]);
      }
      for (let i = 0; i < data.videos.length; i++) {
        formData.append("videos", data.videos[i]);
      }
      const res = await postReq(formData, "item/create", true);
      if (res) {
        notif(res?.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(res?.message ?? "Failed to add data");
        window.scroll({ top: 0, behavior: "smooth" });
        setActionBtn({ text: "Save", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      setActionBtn({ text: "Save", isDisabled: false });
    }
  };

  const closeModal = (state: boolean) => {
    setWarning("");
    setData({ title: "", description: "", brand: "", photos: [], videos: [] });
    toggleModal({ state: state, action: "create" });
  };

  if (loading) {
    return;
  }

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
        <TextAreaField
          label="Add description"
          id="description"
          placeholder="Enter description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        <Selectable
          items={brands.map((brand: Brand) => ({
            label: brand.title,
            value: brand._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Brand name"
        />
        <FileUpload
          id="photos"
          label="Upload photos"
          onChange={(e) => handleFileChange(e, "photos")}
        />
        <FileUpload
          id="videos"
          label="Upload videos"
          onChange={(e) => handleFileChange(e, "videos")}
        />
        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddUpdateItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddUpdateItem;
