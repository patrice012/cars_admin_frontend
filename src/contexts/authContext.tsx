"use client";

import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "../hooks/useStorageHook";
import postReq from "../helpers/postReq";
import { IUser, ResponseData } from "../helpers/types";
import UserContext from "./UserContext";

const AuthContext = createContext<{
  signIn: (data: any) => Promise<boolean | IUser>;
  signOut: () => void;
  checkConnection: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => false,
  signOut: () => null,
  checkConnection: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

type signInProps = {
  email: string;
  password: string;
};

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[iLoading, loginData], setLoginData] = useStorageState("userData");
  const { changeLogin } = useContext(UserContext);

  type ResponseResult = {
    token: string;
    user: IUser;
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (signInData: signInProps) => {
          const result: ResponseData = await postReq({
            data: signInData,
            url: "auth/admin/login",
          });
          if (result.status == 200) {
            const { token, user } = result.data as ResponseResult;
            setLoginData(JSON.stringify(user));
            setSession(token);
            return user;
          }
          return false;
        },
        signOut: () => {
          setSession(null);
        },
        checkConnection: () => {
          if (loginData) {
            const data = JSON.parse(loginData);
            changeLogin(data as IUser);
          }
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
