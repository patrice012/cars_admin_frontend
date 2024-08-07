import React from "react";
import { IoIosClose } from "react-icons/io";

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

// Modal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   title: PropTypes.string.isRequired,
//   warning: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   closeModal: PropTypes.func.isRequired,
// };

export default Modal;

interface DeleteModalProps {
  data: object;
  isOpen: boolean;
  closeModal: Function;
}

export const DeleteModal = ({ data, isOpen, closeModal }: DeleteModalProps) => {
  // const navigate = useNavigate();

  // const handleRemove = async () => {
  //   try {
  //     const res = await postReq({ id: data._id }, "/api/site/delete");
  //     if (res.code === "ok") {
  //       notif("success", "Data has been deleted");
  //       toggleDeleteData(true);
  //       navigate("/sites");
  //     } else {
  //       notif("error", "Failed to delete data");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
        <div className="modal-box flex items-center gap-8">
          <button
            onClick={handleCloseModal}
            className="btn btn--default flex items-center justify-center gap-2"
          >
            <span>Cancel</span>
          </button>

          <button
            // onClick={handleRemove}
            className="btn btn--action flex items-center justify-center gap-2"
          >
            <span>Confirm</span>
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
