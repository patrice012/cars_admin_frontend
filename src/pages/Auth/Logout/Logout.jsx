import { useEffect } from "react";
import notif from "../../../helpers/notif";

// env
let REACT_APP_DOMAIN = import.meta.env.VITE_REACT_APP_DOMAIN;
let VITE_ENV = import.meta.env.VITE_ENV;

const Logout = () => {
  const handleLogout = async () => {
    try {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("GET", "POST", "OPTIONS");
      headers.append("Access-Control-Allow-Origin", `${REACT_APP_DOMAIN}`);
      headers.append("Access-Control-Allow-Credentials", "true");

      const response = await fetch(`${REACT_APP_DOMAIN}/api/logout`, {
        mode: "cors",
        method: "GET",
        headers: headers,
        credentials: "include",
      });

      const serverMessage = await response.json();

      notif(serverMessage.message);

      if (serverMessage.code === "ok") {
        window.location.reload(false);
        window.location.href = "/";
      }
    } catch (err) {
      notif("server error try again later");
      if (VITE_ENV === "development") {
        console.log(err);
      }
    }
  };
  handleLogout();
  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Logout...</div>;
};

export default Logout;
