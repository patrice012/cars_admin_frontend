import { useEffect } from "react";
import { useSession } from "../../contexts/authContext";

const Logout = () => {
  const { signOut } = useSession();

  useEffect(() => {
    signOut();
  }, []);

  return <div>Logout...</div>;
};

export default Logout;
