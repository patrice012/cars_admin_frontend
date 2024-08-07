import {  Link } from "react-router-dom";

const NotFound = () => {

  return (
    <div className="centerer notfound">
      <h1>404</h1>
      <Link to={"/home"}>
        <button className="btn ">Go back to home</button>
      </Link>
    </div>
  );
};

export default NotFound;
