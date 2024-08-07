import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
// add proptype
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import PropTypes from "prop-types";

export const UpdateSite = ({ isOpen, toggleModal, updateData }) => {
  const [data, setData] = useState({
    name: "",
    url: "",
    id: "",
  });

  const [actionBtn, setActionBtn] = useState({
    text: "Save",
    isDisabled: false,
  });

  const [warning, setWarning] = useState("");

  const checkUrl = (url) => {
    const regex = /^(http|https):\/\/[^ "]+$/;
    return regex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!data.name || !data.url) {
        setWarning("Please fill all fields");
        return;
      }

      if (!checkUrl(data.url)) {
        setWarning("Please enter a valid URL");
        return;
      }
      setActionBtn({ text: "Saving...", isDisabled: true });
      const reqData = {
        name: data.name,
        url: data.url,
        id: data._id,
      };
      const res = await postReq({ ...reqData }, "/api/site/update");
      if (res.code === "ok") {
        notif(res?.message ?? "success, Data has been added");
        setActionBtn({ text: "Save", isDisabled: false });
        closeModal(true);
      } else {
        notif(res?.message ?? "Failed to save data");
        setWarning("");
        setActionBtn({ text: "Save", isDisabled: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = (state) => {
    setWarning("");
    let name = data.name;
    setData({ name: "", url: "" });
    toggleModal({ state: state, action: "update", kwargs: { name } });
  };

  useEffect(() => {
    if (updateData) {
      setData(updateData);
    }
  }, [updateData]);

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
            <div className="form-group">
              <input
                type="text"
                id="name"
                placeholder="Enter site name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="url"
                placeholder="Enter site url"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
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

UpdateSite.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  updateData: PropTypes.object.isRequired,
};
