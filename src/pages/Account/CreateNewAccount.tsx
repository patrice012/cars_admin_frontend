import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../contexts/authContext";
import notif from "../../helpers/notif";
import postReq from "../../helpers/postReq";

const CreateNewAccount = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
  });

  const [isLoading, setIsloading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleCreateAccount = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // verify if username don't have spaces and special caracters
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(data.username)) {
      return notif("Nom d'utilisateur incorrect");
    }

    if (data.username && data.email) {
      setIsloading(true);
      // send req
      const result = await postReq({
        data,
        url: "user/create/admin",
        extras: [{ key: "authorization", value: `Bearer ${session}` }],
      });
      console.log(data);
      console.log(result);
      setIsloading(false);
      if (result.status == 201) {
        navigate(-1);
      }
    }
  };

  return (
    <div className="your-account">
      {/* create user */}
      <div className="change change-name">
        <label htmlFor="keyword">Create New Admin User</label>
        <form>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="input input-bordered w-full"
            value={data.username}
            required
            onChange={handleChange}
          />
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            value={data.email}
            required
            onChange={handleChange}
          />
          {isLoading && (
            <button className="btn btn-primary loading">processing...</button>
          )}
          {!isLoading && (
            <button onClick={handleCreateAccount} className="btn btn-primary">
              Create
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateNewAccount;
