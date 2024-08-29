import { Link } from "react-router-dom";

const NoConnection = () => {
  return (
    <div
      className="notfound"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 className="self-center">No connection</h1>
      <Link to={"/"}>
        <button className="btn ">Refresh</button>
      </Link>
    </div>
  );
};

export default NoConnection;
