import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [login, setLogin] = useState(null);

  const changeLogin = (newLogin) => {
    setLogin(newLogin);
  };

  return (
    <UserContext.Provider value={{ login, changeLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
