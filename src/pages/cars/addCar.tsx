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
import { useSession } from "../../contexts/authContext";
import { defaultCarDoorsCount, defaultCarsYear } from "../../helpers/constants";
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
    name: "",
    modelId: "",
    colorId: "",
    engineTypeId: "",
    transmissionId: "",
    fuelTypeId: "",
    titleId: "",
    cityId: "",
    sellerId: "",
    cylinders: 0,
    year: 2023,
    doorsCount: 4,
    odometer: 0,
    salesPrice: 0,
    minPrice: 0,
    imagesUrls: [],
    keywords: [],
    isElectric: false,
    isHybrid: false,
    note: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [colors, setColors] = useState([]);
  const [titles, setTitles] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [engines, setEngines] = useState([]);
  const [cities, setCities] = useState([]);
  const [fuels, setFuels] = useState([]);

  const fetchData = async (
    url: string,
    setState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    const result = await postReq({
      data: {},
      url,
      extras,
    });
    if (result.status === 200) {
      console.log(result.data.data);
      setState(result.data.data);
    }
  };

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

    console.log(data);

    if (
      !data.name ||
      !data.cityId ||
      !data.colorId ||
      !data.modelId ||
      !data.engineTypeId ||
      !data.minPrice ||
      !data.fuelTypeId ||
      !data.salesPrice ||
      !data.sellerId
    ) {
      setWarning("Please fill all fields");
      return;
    }
    setActionBtn({ text: "Saving...", isDisabled: true });
    try {
      const formData = new FormData();

      const res = await postReq({
        data: { ...data, imagesUrls: [""] },
        url: "car/create",
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
    setData({
      name: "",
      modelId: "",
      colorId: "",
      engineTypeId: "",
      transmissionId: "",
      fuelTypeId: "",
      titleId: "",
      cityId: "",
      sellerId: "",
      cylinders: 0,
      year: 2023,
      doorsCount: 4,
      odometer: 0,
      salesPrice: 0,
      minPrice: 0,
      imagesUrls: [],
      keywords: [],
      isElectric: false,
      isHybrid: false,
      note: "",
    });
    toggleModal({ state: state, action: "create" });
  };

  /* if (loading) {
    return;
  } */

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
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <TextAreaField
          label="Add note"
          id="note"
          placeholder="Enter note"
          value={data.note}
          onChange={(e) => setData({ ...data, note: e.target.value })}
        />

        <Selectable
          items={models.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !models.length && fetchData("model", () => setModels)}
          onChange={(e) => setData({ ...data, modelId: e.target.value })}
          title="Model name"
        />

        <Selectable
          items={defaultCarDoorsCount.map((item) => ({
            label: item.toString(),
            value: item,
          }))}
          onChange={(e) =>
            setData({ ...data, doorsCount: Number(e.target.value) })
          }
          title="Car doors"
        />
        <InputField
          label="Sales price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.salesPrice === 0 ? "" : data.salesPrice}
          onChange={(e) =>
            setData({ ...data, salesPrice: Number(e.target.value) })
          }
        />
        <InputField
          label="Minimum price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.minPrice === 0 ? "" : data.minPrice}
          onChange={(e) =>
            setData({ ...data, minPrice: Number(e.target.value) })
          }
        />
        <Selectable
          items={colors.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !colors.length && fetchData("colors", () => setColors)}
          onChange={(e) => setData({ ...data, colorId: e.target.value })}
          title="Color "
        />
        <Selectable
          items={sellers.map((item: characsItemProps) => ({
            label: item.firstname + " " + item.lastname,
            value: item._id,
          }))}
          onOpen={() =>
            !sellers.length && fetchData("seller", () => setSellers)
          }
          onChange={(e) => setData({ ...data, sellerId: e.target.value })}
          title="Seller"
        />
        <Selectable
          items={titles.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !titles.length && fetchData("title", () => setTitles)}
          onChange={(e) => setData({ ...data, titleId: e.target.value })}
          title="Title"
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, year: Number(e.target.value) })}
          title="Car year"
        />
        <Selectable
          items={cities.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !cities.length && fetchData("city", () => setCities)}
          onChange={(e) => setData({ ...data, cityId: e.target.value })}
          title="City"
        />
        <InputField
          label="Cylinders"
          id="title"
          type="text"
          placeholder="Ex: 3"
          value={data.cylinders}
          onChange={(e) =>
            setData({ ...data, cylinders: Number(e.target.value) })
          }
        />
        <InputField
          label="Odometre"
          id="title"
          type="text"
          placeholder="Ex: 3"
          value={data.odometer}
          onChange={(e) =>
            setData({ ...data, odometer: Number(e.target.value) })
          }
        />
        <Selectable
          items={transmissions.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() =>
            !transmissions.length &&
            fetchData("transmission", () => setTransmissions)
          }
          onChange={(e) => setData({ ...data, transmissionId: e.target.value })}
          title="Transmission"
        />
        <Selectable
          items={engines.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() =>
            !engines.length && fetchData("engine_type", () => setEngines)
          }
          onChange={(e) => setData({ ...data, engineTypeId: e.target.value })}
          title="Engine"
        />

        <Selectable
          items={fuels.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !fuels.length && fetchData("fuel_type", () => setFuels)}
          onChange={(e) => setData({ ...data, fuelTypeId: e.target.value })}
          title="Fuels"
        />
        <div className=" flex justify-start items-center" style={{ gap: 20 }}>
          <span>Hybrid car</span>
          <input
            type="checkbox"
            className=""
            onChange={(e) => setData({ ...data, isHybrid: e.target.checked })}
          />
        </div>
        <div className=" flex justify-start items-center" style={{ gap: 20 }}>
          <span>Electric car</span>
          <input
            type="checkbox"
            className=" items-start justify-start flex"
            onChange={(e) => setData({ ...data, isElectric: e.target.checked })}
          />
        </div>

        <FileUpload
          id="photos"
          label="Upload photos"
          onChange={(e) => handleFileChange(e, "imagesUrls")}
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
