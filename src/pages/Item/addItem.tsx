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
import { useSession } from "../../contexts/authContext";
import {
  defaultCarDoorsCount,
  defaultCarsYear,
  defaultQuestion,
} from "../../helpers/constants";
import { mockItemList } from "../../helpers/mockData";
import { characsItemProps } from "../../helpers/types";

interface AddItemProps {
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, toggleModal }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [itemList, setItemList] = useState<any[]>([
    { name: "Item 1", _id: "item1" },
    { name: "Item 2", _id: "item2" },
  ]);
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
    const result = await postReq({
      data: {},
      url: "brand",
      extras: [{ key: "authorization", value: "Bearer " + session }],
    });
    if (result.status == 200) return result.data;
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
      const res = await postReq({
        data: formData,
        url: "item/create",
        isFileUpload: true,
        extras,
      });
      console.log(res.status);
      if (res.status == 201) {
        notif(res?.data.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(res?.data.message ?? "Failed to add data");
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
          required
          label="Car name"
          id="name"
          type="text"
          placeholder="Enter name"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <TextAreaField
          label="Add note"
          id="note"
          placeholder="Enter description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Brand name"
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Model name"
        />
        <Selectable
          items={defaultCarDoorsCount.map((item) => ({
            label: item.toString(),
            value: item.toString(),
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Car doors"
        />
        <InputField
          label="Sales price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <InputField
          label="Minimum price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Car color"
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Seller"
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Car title"
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Country"
        />
        <Selectable
          items={mockItemList.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="City"
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Car year"
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Transmission"
        />
        <InputField
          label="Cylinders"
          id="title"
          type="number"
          placeholder="Ex: 3"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Engine type"
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Fuel type"
        />
        <Selectable
          items={defaultQuestion.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Hybrid car"
        />
        <Selectable
          items={defaultQuestion.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Electric car"
        />
        <FileUpload
          id="photos"
          label="Upload photos"
          onChange={(e) => handleFileChange(e, "photos")}
        />
        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddItem;
