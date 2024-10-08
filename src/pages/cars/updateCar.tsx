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
import { useQuery } from "react-query";
import { Brand } from "../../models/brand.model";
import { useSession } from "../../contexts/authContext";
import Item from "../../models/item.model";
import { MdClose } from "react-icons/md";
import {
  defaultCarDoorsCount,
  defaultCarsYear,
  defaultQuestion,
} from "../../helpers/constants";
import { characsItemProps } from "../../helpers/types";

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
    name: item.name,
    model: item.model._id,
    color: item.color._id,
    engineType: item.engineType._id,
    transmission: item.transmission._id,
    fuelType: item.fuelType._id,
    title: item.title._id,
    city: item.city._id,
    seller: item.seller._id,
    cylinders: item.cylinders,
    year: item.year,
    doorsCount: item.doorsCount,
    odometer: item.odometer,
    salesPrice: item.salesPrice,
    minPrice: item.minPrice,
    imagesUrls: item.imagesUrls,
    keywords: item.keywords.join(";"),
    isElectric: item.isElectric,
    isHybrid: item.isHybrid,
    note: item.note,
    oldphotos: [],
    uploadsImages: [],
  });
  const [itemPhotos, setItemPhotos] = useState<any[]>([]);
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

  useEffect(() => {
    setData({ ...data, oldphotos: item.imagesUrls });
    setItemPhotos(item.imagesUrls);
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
        setData({ ...data, imagesUrls: d });
      }
    }
  };

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
    setData((prevData) => ({ ...prevData, [type]: files }));
  };

  useEffect(() => {
    setItemPhotos(itemPhotos.concat(data.imagesUrls));
    // setData({...data, oldphotos: itemPhotos.filter(e => e == )})
  }, [data.imagesUrls]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!data.name) {
      setWarning("Please fill all fields");
      return;
    }

    console.log(data);

    setActionBtn({ text: "Saving...", isDisabled: true });
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "uploadsImages" && Array.isArray(value)) {
          // Append each element of the uploadsImages array individually
          value.forEach((item) => {
            formData.append("uploadsImages", item);
          });
        } else if (key === "imagesUrls") {
          // Ensure imagesUrls is always an array, even if it's just a single string
          const urls = Array.isArray(value) ? value : [value]; // Convert string to array if necessary
          urls.forEach((item) => {
            formData.append("imagesUrls[]", item); // Ensure it's appended as an array
          });
        } else if (key === "keywords") {
          const keywordsArray = value
            .split(";")
            .map((keyword: string) => keyword.trim());

          keywordsArray.forEach((keyword: string) => {
            formData.append("keywords", keyword);
          });
        } else {
          // For other data types, append directly
          formData.append(key, value);
        }
      });

      formData.append("_id", item._id);

      const res = await postReq({
        data: formData,
        url: "car/update",
        extras,
        isFileUpload: true,
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

  return (
    <Modal
      isOpen={isOpen}
      title="Update Item"
      warning={warning}
      closeModal={() => closeModal(false)}>
      <form style={{ maxWidth: 600, width: 600 }} onSubmit={handleSubmit}>
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
          items={
            models.length
              ? models.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.color.name,
                    value: data.fuelType,
                  },
                ]
          }
          onOpen={() => !models.length && fetchData("model", setModels)}
          onChange={(e) => setData({ ...data, model: e.target.value })}
          selected={data.model}
          title="Model name"
        />
        <Selectable
          items={defaultCarDoorsCount.map((item) => ({
            label: item.toString(),
            value: item,
          }))}
          onChange={(e) =>
            setData({ ...data, doorsCount: parseInt(e.target.value) })
          }
          selected={data.doorsCount}
          title="Car doors"
        />
        <InputField
          label="Sales price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.salesPrice}
          onChange={(e) =>
            setData({ ...data, salesPrice: parseInt(e.target.value) })
          }
        />
        <InputField
          label="Minimum price"
          id="title"
          type="text"
          placeholder="Ex: 100000"
          value={data.minPrice}
          onChange={(e) =>
            setData({ ...data, minPrice: parseInt(e.target.value) })
          }
        />
        <Selectable
          items={
            colors.length
              ? colors.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.color.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() => !colors.length && fetchData("colors", setColors)}
          onChange={(e) => setData({ ...data, color: e.target.value })}
          title="Color "
          selected={data.color}
        />
        <Selectable
          items={
            sellers.length
              ? sellers.map((item: characsItemProps) => ({
                  label: item.firstname + " " + item.lastname,
                  value: item._id,
                }))
              : [
                  {
                    label: item.seller.firstname, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() => !sellers.length && fetchData("seller", setSellers)}
          onChange={(e) => setData({ ...data, seller: e.target.value })}
          title="Seller"
          selected={data.seller}
        />
        <Selectable
          items={
            titles.length
              ? titles.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.title.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
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
          onChange={(e) => setData({ ...data, year: parseInt(e.target.value) })}
          title="Car year"
          selected={data.year}
        />
        <Selectable
          items={
            cities.length
              ? cities.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.city.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() => !cities.length && fetchData("city", setCities)}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          title="City"
          selected={data.city}
        />
        <InputField
          label="Cylinders"
          id="title"
          type="number"
          placeholder="Ex: 3"
          value={data.cylinders}
          onChange={(e) =>
            setData({ ...data, cylinders: parseInt(e.target.value) })
          }
        />
        <InputField
          label="Odometre"
          id="title"
          type="number"
          placeholder="Ex: 3"
          value={data.odometer}
          onChange={(e) =>
            setData({ ...data, odometer: parseInt(e.target.value) })
          }
        />
        <Selectable
          items={
            transmissions.length
              ? transmissions.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.transmission.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() =>
            !transmissions.length && fetchData("transmission", setTransmissions)
          }
          onChange={(e) => setData({ ...data, transmission: e.target.value })}
          title="Transmission"
          selected={data.transmission}
        />
        <Selectable
          items={
            engines.length
              ? engines.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.engineType.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() => !engines.length && fetchData("engine_type", setEngines)}
          onChange={(e) => setData({ ...data, engineType: e.target.value })}
          title="Engine"
          selected={data.engineType}
        />
        <Selectable
          items={
            fuels.length
              ? fuels.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : [
                  {
                    label: item.fuelType.name, // Afficher le label de l'élément sélectionné
                    value: data.fuelType, // Conserver la valeur sélectionnée avant le chargement
                  },
                ]
          }
          onOpen={() => !fuels.length && fetchData("fuel_type", setFuels)} // Charger les données au clic si elles ne sont pas encore chargées
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
          <span>Electric car</span>
          <input
            type="checkbox"
            className=" items-start justify-start flex"
            checked={data.isElectric}
            onChange={(e) => setData({ ...data, isElectric: e.target.checked })}
          />
        </div>
        <div className=" flex justify-start items-center" style={{ gap: 20 }}>
          <span>Hybrid car</span>
          <input
            type="checkbox"
            className=" items-start justify-start flex"
            checked={data.isHybrid}
            onChange={(e) => setData({ ...data, isHybrid: e.target.checked })}
          />
        </div>
        <FileUpload
          id="photos"
          label="Upload photos"
          onChange={(e) => handleFileChange(e, "uploadsImages")}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 13,
          }}>
          {itemPhotos.map((uri, index) => (
            <ImageDisplayItem
              onClick={() => removeImage(index, uri)}
              item={uri}
            />
          ))}
        </div>

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
    <div
      className="w-[220px] h-[140px] cursor-pointer"
      style={{ position: "relative" }}>
      <img
        src={typeof item == "string" ? item : URL.createObjectURL(item)}
        style={{ height: "100%", width: "100%" }}
      />
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          background: "red",
          cursor: "pointer",
        }}>
        <MdClose color="white" size="20px" />
      </div>
    </div>
  );
};
