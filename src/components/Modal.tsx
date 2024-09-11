import React, { useState } from "react";
import { IoIosClose } from "react-icons/io";
import postReq from "../helpers/postReq";
import notif from "../helpers/notif";
import { useSession } from "../contexts/authContext";

interface ModalProps {
  isOpen: boolean;
  title: string;
  warning: string;
  children: React.ReactNode;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  warning,
  children,
  closeModal,
}) => {
  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="upload-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container site" role="dialog">
        <div className="modal-box flex flex-col items-center gap-8">
          {warning && (
            <div className="alert alert-warning text-center" role="alert">
              {warning}
            </div>
          )}
          <h3 className="text-lg font-bold">{title}</h3>
          {children}
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={closeModal} />
          </label>
        </div>
      </div>
    </>
  );
};

export default Modal;

interface DeleteModalProps {
  _id: string;
  url: string;
  isOpen: boolean;
  closeModal: Function;
  deleteItem: (isDeleted: boolean) => void;
}

interface DeleteManyModalProps {
  _id: Array<string>;
  url: string;
  isOpen: boolean;
  closeModal: Function;
  deleteItem: (isDeleted: boolean) => void;
}

export const DeleteModal = ({
  _id,
  url,
  isOpen,
  closeModal,
  deleteItem,
}: DeleteModalProps) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [actionBtn, setActionBtn] = useState({
    text: "Delete",
    isDisabled: false,
  });
  const handleRemove = async () => {
    setActionBtn({ text: "Deleting...", isDisabled: true });

    try {
      const res = await postReq({ data: { _id: _id }, url, extras });
      if (res) {
        notif(res?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Delete", isDisabled: false });
        deleteItem(true);
      } else {
        notif("Failed to delete data");
        deleteItem(false);
      }
    } catch (error) {}
  };

  const handleCloseModal = () => {
    closeModal(isOpen);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="delete-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box flex items-center  gap-8">
          <button
            onClick={handleCloseModal}
            className="btn btn--action  flex items-center justify-center gap-2">
            <span>Cancel</span>
          </button>

          <button
            onClick={handleRemove}
            style={{ background: "red", color: "#FFF" }}
            className="btn flex items-center justify-center gap-2">
            <span>{actionBtn.text}</span>
          </button>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={handleCloseModal} />
          </label>
        </div>
      </div>
    </>
  );
};

export const DeleteManyModal = ({
  _id,
  url,
  isOpen,
  closeModal,
  deleteItem,
}: DeleteManyModalProps) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [actionBtn, setActionBtn] = useState({
    text: "Delete",
    isDisabled: false,
  });
  const handleRemove = async () => {
    setActionBtn({ text: "Deleting...", isDisabled: true });

    try {
      const res = await postReq({ data: { carsId: _id }, url, extras });
      if (res) {
        notif(res?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Delete", isDisabled: false });
        deleteItem(true);
      } else {
        notif("Failed to delete data");
        deleteItem(false);
      }
    } catch (error) {}
  };

  const handleCloseModal = () => {
    closeModal(isOpen);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="delete-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box flex items-center  gap-8">
          <button
            onClick={handleCloseModal}
            className="btn btn--action  flex items-center justify-center gap-2">
            <span>Cancel</span>
          </button>

          <button
            onClick={handleRemove}
            style={{ background: "red", color: "#FFF" }}
            className="btn flex items-center justify-center gap-2">
            <span>{actionBtn.text}</span>
          </button>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={handleCloseModal} />
          </label>
        </div>
      </div>
    </>
  );
};

export const DisableModal = ({
  _id,
  url,
  isOpen,
  closeModal,
  deleteItem,
  data,
}: DeleteModalProps & { data: any }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [actionBtn, setActionBtn] = useState({
    text: "Deactivate",
    isDisabled: false,
  });
  console.log(data);
  const handleRemove = async () => {
    setActionBtn({ text: "Deactivating...", isDisabled: true });

    try {
      const res = await postReq({
        data: { ...data, _id: _id },
        url,
        extras,
      });
      if (res) {
        notif(res?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Delete", isDisabled: false });
        deleteItem(true);
      } else {
        notif("Failed to delete data");
        deleteItem(false);
      }
    } catch (error) {}
  };

  const handleCloseModal = () => {
    closeModal(isOpen);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="delete-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box flex items-center  gap-8">
          <button
            onClick={handleCloseModal}
            className="btn btn--action  flex items-center justify-center gap-2">
            <span>Cancel</span>
          </button>

          <button
            onClick={handleRemove}
            style={{ background: "red", color: "#FFF" }}
            className="btn flex items-center justify-center gap-2">
            <span>{actionBtn.text}</span>
          </button>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={handleCloseModal} />
          </label>
        </div>
      </div>
    </>
  );
};

export const DisableModalMany = ({
  _id,
  url,
  isOpen,
  closeModal,
  deleteItem,
  data,
}: DeleteManyModalProps & { data: any }) => {
  const { session } = useSession();
  const extras = [{ key: "authorization", value: "Bearer " + session }];
  const [actionBtn, setActionBtn] = useState({
    text: "Deactivate",
    isDisabled: false,
  });
  console.log(data);
  const handleRemove = async () => {
    setActionBtn({ text: "Deactivating...", isDisabled: true });

    try {
      const res = await postReq({
        data: { ...data, carsId: _id },
        url,
        extras,
      });
      if (res) {
        notif(res?.data.message ?? "Success, Data has been deleted");
        setActionBtn({ text: "Delete", isDisabled: false });
        deleteItem(true);
      } else {
        notif("Failed to delete data");
        deleteItem(false);
      }
    } catch (error) {}
  };

  const handleCloseModal = () => {
    closeModal(isOpen);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="delete-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box flex items-center  gap-8">
          <button
            onClick={handleCloseModal}
            className="btn btn--action  flex items-center justify-center gap-2">
            <span>Cancel</span>
          </button>

          <button
            onClick={handleRemove}
            style={{ background: "red", color: "#FFF" }}
            className="btn flex items-center justify-center gap-2">
            <span>{actionBtn.text}</span>
          </button>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={handleCloseModal} />
          </label>
        </div>
      </div>
    </>
  );
};
