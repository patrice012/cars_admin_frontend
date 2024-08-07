import { MdError } from "react-icons/md";
import PropTypes from "prop-types";

const Error = ({ message = "Something went wrong." }) => {
  return (
    <>
      <div className="p-[1rem] rounded-lg bg-slate-200 hover:bg-gray-200">
        <p className="text-center w-full text-[1rem] flex items-center justify-center gap-4">
          <span className="text-[1rem]">{message}</span>
          <MdError className="w-[26px] h-[26px]" fill="#dc2626" />
        </p>
      </div>
    </>
  );
};

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
