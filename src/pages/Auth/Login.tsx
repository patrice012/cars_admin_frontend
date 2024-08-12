import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import notif from "../../helpers/notif";
import { useSession } from "../../contexts/authContext";
import UserContext from "../../contexts/UserContext";
import { IUser } from "../../helpers/types";

const initialData = {
  email: "",
  password: "",
};

const Login = () => {
  const { signIn } = useSession();
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState(initialData);
  const [isLoading, setIsloading] = useState(false);
  const { changeLogin } = useContext(UserContext);

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      notif("verify inputs and captcha");
      return;
    }
    setIsloading(true);
    const signedIn = await signIn(signInData);
    if (!signedIn) {
      setIsloading(false);
      notif("Invalid credentials");
    } else {
      console.log(signedIn);
      changeLogin(signedIn as IUser);
      return navigate("/");
    }
    setIsloading(false);
  };

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
        <form>
          <label htmlFor="email">Email</label>
          <div className="inputs">
            <input
              id="email"
              type="text"
              placeholder="Email"
              className="input input-bordered input-primary w-full"
              value={signInData.email}
              required
              onChange={(e) =>
                setSignInData({
                  email: e.target.value,
                  password: signInData.password,
                })
              }
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="input input-bordered input-primary w-full"
              value={signInData.password}
              required
              onChange={(e) =>
                setSignInData({
                  email: signInData.email,
                  password: e.target.value,
                })
              }
            />
          </div>

          {isLoading ? (
            <button className="btn btn-primary loading self-center">
              loading...
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="btn btn-primary self-center w-full"
            >
              Login
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
