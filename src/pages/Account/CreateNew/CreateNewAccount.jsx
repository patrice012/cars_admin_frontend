import { useState, useEffect } from "react";

// navigation hook
import { useNavigate } from "react-router-dom";

// helpers
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";

// react query
import { useQuery } from "react-query";

// env file
let VITE_ENV = import.meta.env.VITE_ENV;

const CreateNewAccount = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    username: "",
    email: "",
  });

  const [isLoading, setIsloadind] = useState(false);

  const handleChanges = (e, type) => {
    if (type === "username") {
      setData({
        username: e.target.value,
        email: data.email,
      });
    }

    if (type === "email") {
      setData({
        username: data.username,
        email: e.target.value,
      });
    }
  };
  // handling registration function
  const handleSubmitions = async () => {
    // verify if username don't have spaces and special caracters
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(data.username)) {
      // notif("verify username no space, no special characters");
      return;
    }

    if (data.username !== "" && data.email !== "") {
      const newUser = {
        username: data.username.trim(),
        email: data.email.toLowerCase().trim(),
        date: new Date(),
        page: "account",
      };

      // send req
      return await postReq(newUser, "/api/new-account");
    }
  };

  const { data: newUserData, refetch: sendPost } = useQuery(
    ["new"],
    handleSubmitions,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  const handleNewAccount = async (e) => {
    e.preventDefault();
    setIsloadind(true);

    // send req
    await sendPost();
    setIsloadind(false);
  };

  useEffect(() => {
    if (!newUserData) return;
    if (VITE_ENV === "development") {
      console.log(newUserData);
    }

    if (newUserData?.code === "ok") {
      notif(newUserData?.message);

      // navigate(-1);
      setTimeout(() => {
        navigate("/account");
        window.location.reload(true);
      }, 3000);
    } else {
      notif(newUserData?.message, "error");
    }
  }, [newUserData]);

  return (
    <div className="your-account">
      {/* create user */}
      <div className="change change-name">
        <label htmlFor="keyword">Create New Admin User</label>
        <form onSubmit={handleNewAccount}>
          <input
            id="username"
            type="text"
            placeholder="username"
            className="input input-bordered w-full"
            value={data.username}
            required
            onChange={(e) => handleChanges(e, "username")}
          />
          <input
            id="email"
            type="email"
            placeholder="email"
            className="input input-bordered w-full"
            value={data.email}
            required
            onChange={(e) => handleChanges(e, "email")}
          />
          {isLoading && (
            <button className="btn btn-primary loading">processing...</button>
          )}
          {!isLoading && <button className="btn btn-primary">Create</button>}
        </form>
      </div>
    </div>
  );
};

export default CreateNewAccount;
