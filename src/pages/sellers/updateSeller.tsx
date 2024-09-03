import { useState } from "react";
import Modal from "../../components/Modal";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import PropTypes from "prop-types";
import { useSession } from "../../contexts/authContext";
import { Seller } from "../../models/brand.model";
import PhoneInput from "react-phone-input-2";
import Selectable from "../../components/Selectable";
import { mockItemList } from "../../helpers/mockData";
import { characsItemProps } from "../../helpers/types";
import { useQuery } from "react-query";

interface UpdateSellerProps {
  Seller: Seller;
  isOpen: boolean;
  toggleModal: ({ state, action }: { state: boolean; action: string }) => void;
}

const UpdateSeller: React.FC<UpdateSellerProps> = ({
  isOpen,
  toggleModal,
  Seller,
}) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [data, setData] = useState({
    firstname: Seller.firstname,
    whatsapp: Seller.whatsapp,
    phone: Seller.phone,
    sellerTypeId: Seller.sellerTypeId,
    lastname: Seller.lastname,
  });
  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.lastname || !data.firstname) {
      setWarning("Please fill all fields");
      return;
    }

    setActionBtn({ text: "Saving...", isDisabled: true });

    try {
      const response = await postReq({
        data: { ...data, _id: Seller._id },
        url: "seller/update",
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

  const getSellerType = async () => {
    const result = await postReq({
      data: {},
      url: "seller_type",
      extras: [{ key: "authorization", value: "Bearer " + session }],
    });
    if (result.status == 200) {
      console.log(result.data);
      return result.data;
    }
  };

  const {
    data: sellerType,
    isLoading: loading,
    error,
    refetch: getPaginate,
  } = useQuery(["queryKey"], getSellerType, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const closeModal = (state: boolean) => {
    setWarning("");
    setData({
      firstname: "",
      whatsapp: "",
      phone: "",
      sellerTypeId: "",
      lastname: "",
    });
    toggleModal({ state: state, action: "create" });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add New Item"
      warning={warning}
      closeModal={() => closeModal(false)}>
      <form onSubmit={handleSubmit}>
        <InputField
          label="First name"
          id="firstname"
          type="text"
          placeholder="Enter firstname"
          value={data.firstname}
          onChange={(e) => setData({ ...data, firstname: e.target.value })}
        />
        <InputField
          label="Last name"
          id="lastname"
          type="text"
          placeholder="Enter lastname"
          value={data.lastname}
          onChange={(e) => setData({ ...data, lastname: e.target.value })}
        />
        <Selectable
          items={
            sellerType?.data.length
              ? sellerType?.data.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
              : mockItemList.map((item: characsItemProps) => ({
                  label: item.name,
                  value: item._id,
                }))
          }
          selected={data.sellerTypeId.name}
          onChange={(e) => setData({ ...data, sellerTypeId: e.target.value })}
          title="Seller type"
        />
        <span>Phone number</span>
        <PhoneInput
          country={"tg"}
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e })}
          inputStyle={{
            width: "100%",
            height: 48,
            borderRadius: 8,
            paddingLeft: 70,
          }}
          copyNumbersOnly
          buttonStyle={{ paddingInline: 8 }}
        />
        <span>Whatsapp number</span>
        <PhoneInput
          country={"tg"}
          value={data.whatsapp}
          onChange={(e) => setData({ ...data, whatsapp: e })}
          inputStyle={{
            width: "100%",
            height: 48,
            borderRadius: 8,
            paddingLeft: 70,
          }}
          copyNumbersOnly
          buttonStyle={{ paddingInline: 8 }}
        />
        <Button onClick={handleSubmit} disabled={actionBtn.isDisabled}>
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

UpdateSeller.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};

export default UpdateSeller;
