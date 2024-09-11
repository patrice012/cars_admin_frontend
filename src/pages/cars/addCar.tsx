import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import TextAreaField from "../../components/TextAreaField";
import InputField from "../../components/InputField";
import FileUpload from "../../components/FileUpload";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import { Selectable } from "../../components/Selectable";
import { useSession } from "../../contexts/authContext";
import {
  cylinders,
  defaultCarDoorsCount,
  defaultCarsYear,
} from "../../helpers/constants";
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
    model: "",
    color: "",
    engineType: "",
    transmission: "",
    fuelType: "",
    title: "",
    city: "",
    seller: "",
    cylinders: 0,
    year: 2023,
    doorsCount: 4,
    odometer: 0,
    salesPrice: 0,
    minPrice: 0,
    imagesUrls: [],
    keywords: "",
    isElectric: false,
    isHybrid: false,
    note: "",
    brand: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");
  const [brand, setBrand] = useState("");
  const [models, setModels] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [colors, setColors] = useState([]);
  const [titles, setTitles] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [engines, setEngines] = useState([]);
  const [cities, setCities] = useState([]);
  const [fuels, setFuels] = useState([]);
  const [brands, setBrands] = useState([]);

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
      console.log(data.brand);
      console.log(result.data.data);
      if (data.brand && url === "model") {
        const Models = result?.data?.data.filter(
          (item: { brand: { _id: string } }) => item?.brand?._id === data.brand
        );
        if (!Models) {
          return null;
        }
        console.log(Models);
        setState(Models);
        return;
      }
      setState(result.data.data);
    }
  };

  useEffect(() => {
    setModels([]);
  }, [data.brand]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log(files.length);

    if (files && files.length) {
      const files = Array.from(e.target.files || []);
      setData({ ...data, imagesUrls: files });
    } else {
      notif("Only files could be upload");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(data);

    if (
      !data.name ||
      !data.city ||
      !data.color ||
      !data.model ||
      !data.engineType ||
      !data.minPrice ||
      !data.fuelType ||
      !data.salesPrice ||
      !data.seller ||
      !data.imagesUrls
    ) {
      setWarning("Please fill all fields");
      return;
    }
    setActionBtn({ text: "Saving...", isDisabled: true });
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value) && key == "imagesUrls") {
          // If the value is an array, append each element individually
          value.forEach((item, index) => {
            formData.append("imagesUrls", item);
          });
        } else if (key === "keywords") {

          const keywordsArray = value.split(";").map((keyword: string) => keyword.trim());
    
          keywordsArray.forEach((keyword: string) => {
            formData.append("keywords", keyword); 
          });

        } else {
          // For other data types, append directly
          formData.append(key, value);
        }
      });

      const res = await postReq({
        data: formData,
        url: "car/create",
        extras,
        isFileUpload: true,
      });
      console.log(res);
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
      model: "",
      color: "",
      engineType: "",
      transmission: "",
      fuelType: "",
      title: "",
      city: "",
      seller: "",
      cylinders: 0,
      year: 2023,
      doorsCount: 4,
      odometer: 0,
      salesPrice: 0,
      minPrice: 0,
      imagesUrls: [],
      keywords: "",
      isElectric: false,
      isHybrid: false,
      note: "",
      brand: "",
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
      closeModal={() => closeModal(false)}>
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
          items={brands.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !brands.length && fetchData("brand", setBrands)}
          onChange={(e) => setData({ ...data, brand: e.target.value })}
          title="Brand name"
          selected={data.brand}
        />
        <Selectable
          items={models.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !models.length && fetchData("model", setModels)}
          onChange={(e) => setData({ ...data, model: e.target.value })}
          title="Model name"
          selected={data.model}
        />
        <Selectable
          items={defaultCarDoorsCount.map((item) => ({
            label: item.toString(),
            value: item,
          }))}
          onChange={(e) => setData({ ...data, doorsCount: e.target.value })}
          title="Car doors"
          selected={4}
        />
        <InputField
          label="Sales price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.salesPrice === 0 ? "" : data.salesPrice}
          onChange={(e) => setData({ ...data, salesPrice: e.target.value })}
        />
        <InputField
          label="Minimum price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.minPrice === 0 ? "" : data.minPrice}
          onChange={(e) => setData({ ...data, minPrice: e.target.value })}
        />
        <Selectable
          items={colors.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !colors.length && fetchData("colors", setColors)}
          onChange={(e) => setData({ ...data, color: e.target.value })}
          title="Color "
          selected={data.color}
        />
        <Selectable
          items={sellers.map((item: characsItemProps) => ({
            label: item.firstname + " " + item.lastname,
            value: item._id,
          }))}
          onOpen={() => !sellers.length && fetchData("seller", setSellers)}
          onChange={(e) => setData({ ...data, seller: e.target.value })}
          title="Seller"
          selected={data.seller}
        />
        <Selectable
          items={titles.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !titles.length && fetchData("title", setTitles)}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          title="Title"
          selected={data.title}
        />
        <Selectable
          items={defaultCarsYear.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) => setData({ ...data, year: Number(e.target.value) })}
          title="Car year"
          selected={data.year}
        />
        <Selectable
          items={cities.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !cities.length && fetchData("city", setCities)}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          title="City"
          selected={data.city}
        />
        <Selectable
          items={cylinders.map((item: number) => ({
            label: item,
            value: item,
          }))}
          onChange={(e) =>
            setData({ ...data, cylinders: Number(e.target.value) })
          }
          title="Cylinders"
          selected={data.cylinders}
        />
        <InputField
          label="Odometre"
          id="title"
          type="text"
          placeholder="Ex: 3"
          value={data.odometer}
          onChange={(e) => setData({ ...data, odometer: e.target.value })}
        />
        <Selectable
          items={transmissions.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() =>
            !transmissions.length && fetchData("transmission", setTransmissions)
          }
          onChange={(e) => setData({ ...data, transmission: e.target.value })}
          title="Transmission"
          selected={data.transmission}
        />
        <Selectable
          items={engines.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !engines.length && fetchData("engine_type", setEngines)}
          onChange={(e) => setData({ ...data, engineType: e.target.value })}
          title="Engine"
          selected={data.engineType}
        />

        <Selectable
          items={fuels.map((item: characsItemProps) => ({
            label: item.name,
            value: item._id,
          }))}
          onOpen={() => !fuels.length && fetchData("fuel_type", setFuels)}
          onChange={(e) => setData({ ...data, fuelType: e.target.value })}
          title="Fuels"
          selected={data.fuelType}
        />

        <TextAreaField
          label="keywords"
          id="keywords"
          placeholder="Enter keywords"
          value={data.keywords}
          onChange={(e) => setData({ ...data, keywords: e.target.value })}
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
          onChange={handleFileChange}
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
