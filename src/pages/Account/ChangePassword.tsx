import { useEffect, useState, useContext, ChangeEvent } from "react";
import postReq from "../../helpers/postReq";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import notif from "../../helpers/notif";
import UserContext from "../../contexts/UserContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { login, changeLogin } = useContext(UserContext);
  const [data, setData] = useState({ oldPass: "", newPass: "", confirm: "" });
  const [isLoading, setIsloading] = useState(false);
  const [pwdMatchedWarnings, setPwdMatchedWarnings] = useState({
    matched: false,
    notify: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  // check if password match
  useEffect(() => {
    const { newPass, confirm } = data;
    if ((!newPass && !confirm) || newPass !== confirm) {
      setPwdMatchedWarnings({ matched: false, notify: false });
      return;
    }
  }, [data?.newPass, data?.confirm]);

  //
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsloading(true);
    const result = await postReq({
      data: { ...data, _id: login?._id },
      url: "user/password/change",
    });
    setIsloading(false);
    console.log(result.data);
    if (result.status == 200) {
      notif("Passord changed successfuly");
      navigate(-1);
    } else {
      notif((result.data as { message: string }).message);
    }
  };

  return (
    <>
      <Header page={"Change Password"} headerStatus={""} />

      <div className="your-account">
        {/* create user */}
        <div className="change change-name">
          <label htmlFor="keyword">Change password</label>
          <form>
            <input
              id="oldPass"
              type="password"
              placeholder="Actual Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={handleInputChange}
            />

            <input
              id="newPass"
              type="password"
              placeholder="Your New Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={handleInputChange}
            />
            <input
              id="confirm"
              type="password"
              placeholder="Repeat New Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={handleInputChange}
            />

            {!pwdMatchedWarnings.matched && pwdMatchedWarnings.notify && (
              <span className="error-input">New Password do not match</span>
            )}
            {isLoading && (
              <button className="btn btn-primary loading self-center">
                processing...
              </button>
            )}
            {!isLoading && (
              <button
                onClick={handleSubmit}
                disabled={
                  !pwdMatchedWarnings.matched && pwdMatchedWarnings.notify
                }
                className="btn"
              >
                Update
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
