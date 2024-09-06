import { CiExport } from "react-icons/ci";
import { Link } from "react-router-dom";

let REACT_APP_DOMAIN = import.meta.env.VITE_API_ENDPOINT;

export const ExportBtn = () => {
  return (
    <div className="actions export-data">
      <Link to={`${REACT_APP_DOMAIN}/api/export-proxy`}>
        <CiExport /> <span>Export</span>
      </Link>
    </div>
  );
};
