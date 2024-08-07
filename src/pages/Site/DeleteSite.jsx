import { IoIosClose } from "react-icons/io";
// add proptype
import postReq from "../../helpers/postReq";
import notif from "../../helpers/notif";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const DeleteSite = ({ data, isOpen, toggleDeleteData }) => {
  const navigate = useNavigate();

  const handleRemove = async () => {
    try {
      const res = await postReq({ id: data._id }, "/api/site/delete");
      if (res.code === "ok") {
        notif("success", "Data has been deleted");
        toggleDeleteData(true);
        navigate("/sites");
      } else {
        notif("error", "Failed to delete data");
      }
    } catch (error) {
      console.log(error);
    }
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
            onClick={toggleDeleteData}
            className="btn btn--default flex items-center justify-center gap-2"
          >
            <span>Cancel</span>
          </button>

          <button
            onClick={handleRemove}
            className="btn btn--action flex items-center justify-center gap-2"
          >
            <span>Confirm</span>
          </button>
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={toggleDeleteData} />
          </label>
        </div>
      </div>
    </>
  );
};

DeleteSite.propTypes = {
  data: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleDeleteData: PropTypes.func.isRequired,
};
