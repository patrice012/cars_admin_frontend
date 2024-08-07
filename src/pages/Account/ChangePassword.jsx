import { useEffect, useState, useContext } from "react";
// helpers
import postReq from "../../helpers/postReq";

// react query
import { useQuery } from "react-query";
// helper
import notif from "../../helpers/notif";
// context
import UserContext from "../../contexts/UserContext";
// navigation hook
import { useNavigate } from "react-router-dom";

// components
import Header from "../../components/Header/Header";

const ChangePassword = () => {
  const [data, setData] = useState({});
  const [pwdMatchedWarnings, setPwdMatchedWarnings] = useState({
    matched: false,
    notify: false,
  });
  const navigate = useNavigate();
  // get current account ID
  const { login } = useContext(UserContext);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // add account ID
    data["accountId"] = login?.user?.id;
    // send req
    await sendPost();
  };

  const handlePasswordSubmit = async () => {
    // send req
    return await postReq(data, "/api/auth/change-password");
  };

  const {
    data: resData,
    isLoading,
    refetch: sendPost,
  } = useQuery(["new"], handlePasswordSubmit, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (!resData) return;

    if (resData?.code === "ok") {
      notif(resData?.message);
      navigate(-1);
    } else {
      notif(resData?.message, "error");
    }
  }, [resData]);

  // handling registration function
  const handleInputChange = (e, input_name) => {
    if (input_name === "password") {
      setData({
        ...data,
        ["password"]: e.target.value,
      });
    }
    if (input_name === "new_password") {
      setData({
        ...data,
        ["new_password"]: e.target.value,
      });
    }
    if (input_name === "repeat_new_password") {
      setData({
        ...data,
        ["repeat_new_password"]: e.target.value,
      });
    }
  };

  // check if password match
  useEffect(() => {
    const { new_password, repeat_new_password } = data;
    if (!new_password || !repeat_new_password) return;

    if (!new_password && !repeat_new_password) {
      setPwdMatchedWarnings({ matched: false, notify: false });
      return;
    }
    if (new_password === repeat_new_password) {
      setPwdMatchedWarnings({ matched: true, notify: false });
    } else {
      setPwdMatchedWarnings({ matched: false, notify: true });
    }
  }, [data?.new_password, data?.repeat_new_password]);

  return (
    <>
      <Header page={"Change Password"} />

      <div className="your-account">
        {/* create user */}
        <div className="change change-name">
          <label htmlFor="keyword">Change password</label>
          <form onSubmit={handlePasswordChange}>
            <input
              id="password"
              type="password"
              placeholder="Actual Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={(e) => handleInputChange(e, "password")}
            />

            <input
              id="new-password"
              type="password"
              placeholder="Your New Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={(e) => handleInputChange(e, "new_password")}
            />
            <input
              id="repeat-new-password"
              type="password"
              placeholder="Repeat New Password"
              className="input input-bordered input-primary w-full"
              required
              onChange={(e) => handleInputChange(e, "repeat_new_password")}
            />

            {!pwdMatchedWarnings.matched && pwdMatchedWarnings.notify && (
              <span className="error-input">New Password do not match</span>
            )}
            {isLoading && (
              <button className="btn btn-primary loading">processing...</button>
            )}
            {!isLoading && (
              <button
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
