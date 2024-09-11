import { useEffect, useState } from "react";

import Modal from "../../Modal";
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";
import InputField from "../../InputField";
import Button from "../../Button";

import PropTypes from "prop-types";
import { useSession } from "../../../contexts/authContext";
import Selectable from "../../Selectable";
import { mockItemList } from "../../../helpers/mockData";
import { characsItemProps } from "../../../helpers/types";

export interface hasRelationProps {
  hasRelation?: boolean;
  relationName: string;
  relationData?: any[];
  relationUri?: string;
}

interface AddNewProps {
  isOpen: boolean;
  page: string;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
  hasRelation?: hasRelationProps;
}

const AddNew: React.FC<AddNewProps> = ({
  isOpen,
  toggleModal,
  page,
  hasRelation,
}) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState({
    name: "",
    subItem: "",
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  useEffect(() => {
    try {
      if (hasRelation?.relationData) {
        const item = hasRelation.relationData as { _id: string }[];
        setData({ ...data, subItem: item[0]._id });
      }
    } catch (error) {
      console.log(error);
    }
  }, [hasRelation?.relationData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.name) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      let url = "";
      let subItemTitle = "";
      if (page?.toLowerCase() === "colors") {
        url = "colors/create";
      } else if (page?.toLowerCase() === "cylinders") {
        url = "cylinders/create";
      } else if (page?.toLowerCase() === "enginetype") {
        url = "engine_type/create";
      } else if (page?.toLowerCase() === "model") {
        url = "model/create";
        subItemTitle = "brandId";
      } else if (page?.toLowerCase() === "transmission") {
        url = "transmission/create";
      } else if (page?.toLowerCase() === "fuel") {
        url = "fuel_type/create";
      } else if (page?.toLowerCase() === "title") {
        url = "title/create";
      } else if (page?.toLowerCase() === "countries") {
        url = "country/create";
      } else if (page?.toLowerCase() === "sellertype") {
        url = "seller_type/create";
      } else if (page?.toLowerCase() === "city") {
        url = "city/create";
        subItemTitle = "countryId";
      }

      const response = await postReq({
        data: { ...data, [subItemTitle]: data.subItem },
        url,
        extras,
      });
      if (response.status == 201) {
        notif(response?.data.message ?? "Success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(response?.data.message ?? "Failed to add data");
        setActionBtn({ text: "Save", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      console.log(error);
      setActionBtn({ text: "Save", isDisabled: false });
    }
  };

  const handleSelectSubItem = (itemId: string) => {
    setData({ ...data, subItem: itemId });
  };

  const closeModal = (state: boolean) => {
    setWarning("");
    setData({ ...data, name: "" });
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

        {hasRelation?.hasRelation && (
          <Selectable
            items={hasRelation.relationData!.map((item: characsItemProps) => ({
              label: item.name,
              value: item._id,
            }))}
            onChange={(e) => handleSelectSubItem(e.target.value)}
            selected={data.subItem}
            title={hasRelation.relationName}
          />
        )}

        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

AddNew.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default AddNew;
