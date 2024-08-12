import { createContext, ReactNode, useState } from "react";
import { IUser } from "../helpers/types";

interface UserContextType {
  login: IUser | undefined;
  changeLogin: (newLogin: IUser) => void;
}

const UserContext = createContext<UserContextType>({
  login: undefined,
  changeLogin: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [login, setLogin] = useState<IUser>();

  const changeLogin = (newLogin: IUser) => {
    setLogin(newLogin);
  };

  return (
    <UserContext.Provider value={{ login, changeLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
