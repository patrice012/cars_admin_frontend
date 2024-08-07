import { IoIosClose } from "react-icons/io";
import { useState } from "react";
// add proptype
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

export const CreateNewKwargs = ({ isOpen, toggleModal }) => {
  const location = useLocation();

  const siteId = location.state._id;
  const groupId = location.state.groupId;

  const [data, setData] = useState({
    url: "",
    groupId,
    siteId,
  });

  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });
  const [warning, setWarning] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!data.url) {
        setWarning("Please fill all fields");
        return;
      }

      setActionBtn({ text: "Saving...", isDisabled: true });
      const res = await postReq(
        { ...data, groupId, siteId },
        "/api/site-url/create"
      );
      if (res.code === "ok") {
        notif(res?.message ?? "success, URL has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(res.message ?? "error, Failed to save data");
        setActionBtn({ text: "Save", isDisabled: false });
        setWarning("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = (state) => {
    setWarning("");
    setData({ siteId: "", url: "", groupId: " -1 " });
    toggleModal({
      state: state,
      action: "create",
      kwargs: { refechKey: groupId },
    });
  };

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
            <div className=" text-center" role="alert">
              {warning}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-groupId">
              <input
                type="text"
                id="url"
                placeholder="Enter Keyword"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
                className="w-full"
              />
            </div>
            <button
              disabled={actionBtn.isDisabled}
              className="btn hover:text-black hover:bg-transparent text-white"
            >
              <span>{actionBtn.text}</span>
            </button>
          </form>
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

CreateNewKwargs.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
};
