import React, { useState } from "react";
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import InputField from "../../components/InputField";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const initValue = {
  title: "Hello",
  body: "",
};

const SendToallModal = ({
  _id,
  isOpen,
  closeModal,
}: {
  _id: string;
  isOpen: boolean;
  closeModal: (value: boolean) => void;
}) => {
  const [data, setData] = useState<{ title: string; body: string }>(initValue);
  const [warning, setWarning] = useState("");
  const [actionBtn, setActionBtn] = useState({
    text: "Send",
    isDisabled: false,
  });

  const handleSendToall = async () => {
    setActionBtn({
      text: "Pending ...",
      isDisabled: true,
    });

    try {
      const res = await postReq({
        data: {
          title: data.title,
          body: data.body,
          data: { carId: _id, screen: "carDetails" },
        },
        url: `notification/to/all`,
      });
      if (res) {
        notif(res?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Send", isDisabled: false });
      } else {
        notif("Failed to delete data");
      }
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Send to users"
      warning={warning}
      closeModal={() => closeModal(false)}
    >
      <form>
        <InputField
          label="Message Title"
          id="name"
          type="text"
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />
        <InputField
          label="Message body"
          id="name"
          type="text"
          placeholder="Body"
          value={data.body}
          onChange={(e) => setData({ ...data, body: e.target.value })}
        />
        <Button
          onClick={() => handleSendToall()}
          disabled={actionBtn.isDisabled}
        >
          <span>{actionBtn.text}</span>
        </Button>
      </form>
    </Modal>
  );
};

export default SendToallModal;
