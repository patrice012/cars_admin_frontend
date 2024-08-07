// built in hooks
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// custom  hook
import postReq from "../../../helpers/postReq";
import notif from "../../../helpers/notif";

// env
let VITE_ENV = import.meta.env.VITE_ENV;

const Login = () => {
  // login to site
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
  });

  // login state
  const [isLoading, setIsloadind] = useState(false);
  const [loginCode, setLoginCode] = useState({
    message: undefined,
    code: undefined,
  });

  // useQuery from React query
  const handlePostrequest = async () => {
    // sending data for validation and login to backend
    const inputData = { ...formInputs };

    // post request
    try {
      let res = await postReq(inputData, "/api/login");

      setLoginCode((prev) => ({
        ...prev,
        message: res?.message,
        code: res?.code,
      }));
      if (loginCode.code === "bad") {
        notif(loginCode?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsloadind(true);

    // check if an element from form is empty
    if (!formInputs.email || !formInputs.password) {
      if (VITE_ENV === "development") {
        console.log("error");
      }
      notif("verify inputs and captcha");
      return;
    }

    // send req
    await handlePostrequest();
    // sendPost();
    setIsloadind(false);
  };

  // after check credentials
  const navigate = useNavigate();
  useEffect(() => {
    // redirect to 2fa hash page
    if (loginCode?.code === "ok") {
      navigate(`/home`);
    }
    if (loginCode?.code === "bad") {
      notif(loginCode?.message);
    }
  }, [loginCode?.code, loginCode?.message]);

  return (
    <div className="login-f">
      <div className="login-container">
        <div className="heading">
          {/* logo */}
          <h1>Admin</h1>

          {/* login text */}
          <h2>Log in to the dashboard</h2>
        </div>

        {/* form */}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <div className="inputs">
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="input input-bordered input-primary w-full"
              value={formInputs.email}
              required
              onChange={(e) =>
                setFormInputs({
                  email: e.target.value,
                  password: formInputs.password,
                })
              }
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="input input-bordered input-primary w-full"
              value={formInputs.password}
              required
              onChange={(e) =>
                setFormInputs({
                  email: formInputs.email,
                  password: e.target.value,
                })
              }
            />
          </div>

          {isLoading && (
            <button className="btn btn-primary loading">loading...</button>
          )}
          {!isLoading && <button className="btn btn-primary">Login</button>}
        </form>
      </div>
    </div>
  );
};

export default Login;
