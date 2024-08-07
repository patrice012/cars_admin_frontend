import { IoIosClose } from "react-icons/io";
// add proptype
import PropTypes from "prop-types";

const ViewTableData = ({ data, isOpen, toggleViewData }) => {
  let dataMap = [];

  Object.entries(data).map(([key, value]) => {
    let _key = key.replace(/_/g, " ").toLowerCase();
    dataMap.push({ [_key]: String(value) || "Not allowed" });
  });

  return (
    <>
      <input
        type="checkbox"
        checked={isOpen}
        readOnly
        id="upload-modal"
        className="modal-toggle"
      />
      <div className="modal modal--container" role="dialog">
        <div className="modal-box">
          {data && (
            <div className="uploaded-files">
              <div className="dataTable">
                <div className="overflow-x-auto">
                  <div className="grid-table-container">
                    <div className="grid-table table-header">
                      <span>Attributes</span>
                      <span>Values</span>
                    </div>
                    {dataMap.map((elm, idx) => {
                      return (
                        <div className="grid-table" key={idx}>
                          <span className="key">{Object.keys(elm)[0]}</span>
                          <span className="value">{Object.values(elm)[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="wrapper">
          <label className="modal-backdrop close-modal" htmlFor="upload-modal">
            <IoIosClose onClick={toggleViewData} />
          </label>
        </div>
      </div>
    </>
  );
};

ViewTableData.propTypes = {
  data: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggleViewData: PropTypes.func.isRequired,
};

export default ViewTableData;
