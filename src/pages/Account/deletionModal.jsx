// icons
import {  BsTrash } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
// context
export const DeleteModalConfirmation = ({
  isDeleting,
  checkConfirmation,
  toggleModal,
  warning = null,
  index,
}) => {
  return (
    <>
      <input
        type="checkbox"
        checked={isDeleting}
        readOnly
        id="modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box">
          {warning && (
            <div className="upload-warnings mb-5">
              <p>{warning?.message}</p>
            </div>
          )}
          <div className="flex items-center justify-center gap-8 w-full mx-auto">
            <button
              onClick={(e) => {
                e.preventDefault();
                checkConfirmation(null);
              }}
              className="btn btn--default flex items-center justify-center gap-2"
            >
              <span className="leading-6">Cancel</span>
              {/* <BsUpload /> */}
            </button>
            <button
              className="btn btn--action flex items-center justify-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                checkConfirmation(index);
              }}
            >
              <span>Confirm</span>
              <BsTrash />
            </button>
          </div>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={() => toggleModal()} />
          </label>
        </div>
      </div>
    </>
  );
};
