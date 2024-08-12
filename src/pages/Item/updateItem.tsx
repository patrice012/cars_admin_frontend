import { useEffect, useState } from "react";
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
import { useSession } from "../../contexts/authContext";
import Item from "../../models/item.model";
import { MdClose } from "react-icons/md";

interface UpdateItemProps {
  item: Item;
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const UpdateItem: React.FC<UpdateItemProps> = ({
  isOpen,
  toggleModal,
  item,
}) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState({
    title: item.title,
    description: item.description ?? "",
    brand: item.brand._id,
    photos: item.photos,
    videos: item.videos ?? [],
    oldphotos: [""],
  });
  const [itemPhotos, setItemPhotos] = useState<any[]>([]);
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  useEffect(() => {
    setData({ ...data, oldphotos: item.photos });
    setItemPhotos(item.photos);
  }, [isOpen]);

  const removeImage = (index: number, uri?: string) => {
    const items = itemPhotos;
    items.splice(index, 1);
    setItemPhotos([...items]);
    if (uri) {
      const idx = data.oldphotos.indexOf(uri);
      if (idx > -1) {
        const d = data.oldphotos;
        d.splice(idx, 1);
        setData({ ...data, oldphotos: d });
      }
    }
  };

  const getBrands = async () => {
    const result = await postReq({
      data: {},
      url: "brand",
      extras,
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
    setData((prevData) => ({ ...prevData, [type]: files }));
  };

  useEffect(() => {
    setItemPhotos(itemPhotos.concat(data.photos));
    // setData({...data, oldphotos: itemPhotos.filter(e => e == )})
  }, [data.photos]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data.title || !data.brand) {
      setWarning("Please fill all fields");
      return;
    }
    setActionBtn({ text: "Saving...", isDisabled: true });
    try {
      const formData = new FormData();
      formData.append("_id", item._id);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("brand", data.brand);
      formData.append("oldphotos", data.oldphotos.toString());
      for (let i = 0; i < data.photos.length; i++) {
        formData.append("photos", data.photos[i]);
      }
      for (let i = 0; i < data.videos.length; i++) {
        formData.append("videos", data.videos[i]);
      }
      const res = await postReq({
        data: formData,
        url: "item/update",
        isFileUpload: true,
        extras,
      });
      if (res.status == 200) {
        notif(res?.data.message ?? "Success, Data has been updated");
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
    toggleModal({ state: state, action: "create" });
  };

  if (loading) {
    return;
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Update Item"
      warning={warning}
      closeModal={() => closeModal(false)}
    >
      <form style={{ maxWidth: 600, width: 600 }} onSubmit={handleSubmit}>
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
        {item.brand && brands && (
          <Selectable
            selected={{ label: item.brand.title, value: item.brand._id }}
            items={brands.map((brand: Brand) => ({
              label: brand.title,
              value: brand._id,
            }))}
            onChange={(e) => setData({ ...data, brand: e.target.value })}
            title="Brand name"
          />
        )}
        <FileUpload
          id="photos"
          label="Upload photos"
          onChange={(e) => handleFileChange(e, "photos")}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 13,
          }}
        >
          {itemPhotos.map((uri, index) => (
            <ImageDisplayItem
              onClick={() => removeImage(index, uri)}
              item={uri}
            />
          ))}
        </div>
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

UpdateItem.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UpdateItem;

const ImageDisplayItem = ({
  item,
  onClick,
}: {
  item: any;
  onClick: () => void;
}) => {
  return (
    <div style={{ width: 170, position: "relative" }}>
      <img src={typeof item == "string" ? item : URL.createObjectURL(item)} />
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          cursor: "pointer",
        }}
      >
        <MdClose color="white" size="20px" />
      </div>
    </div>
  );
};
