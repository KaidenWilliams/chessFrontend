import { Context, createContext, useState } from "react";

const CURRENT_USER_KEY: string = "CurrentUserKey";
const AUTH_TOKEN_KEY: string = "AuthTokenKey";
const AUTH_EXPIRATION_KEY: string = "AuthExpiry";

// Auth info interface
interface IAuthInfo {
  currentUser: string | null;
  authToken: string | null;
}

// Auth actions interface
interface IAuthActions {
  updateUserInfo: (currentUser: string, authToken: string) => void;
  clearUserInfo: () => void;
  isAuthenticated: () => boolean;
}

// Auth context interface as combination of info and actions
interface IAuthContext extends IAuthInfo, IAuthActions {}

// Default auth info
const defaultAuthInfo: IAuthInfo = {
  currentUser: null,
  authToken: null,
};

// Default auth actions
const defaultAuthActions: IAuthActions = {
  updateUserInfo: () => null,
  clearUserInfo: () => null,
  isAuthenticated: () => false,
};

// AuthContext created, initially provided with default values (to make Typescript happy)
export const AuthContext: Context<IAuthContext> = createContext<IAuthContext>({
  ...defaultAuthInfo,
  ...defaultAuthActions,
});

interface Props {
  children: React.ReactNode;
}

const AuthContextProvider = (props: Props) => {
  // Functions to update and clear context
  const updateUserInfo = (currentUser: string, authToken: string) => {
    setAuthInfoState({ currentUser, authToken });
    saveToLocalStorage(currentUser, authToken);
  };

  const clearUserInfo = () => {
    setAuthInfoState({ currentUser: null, authToken: null });
    clearLocalStorage();
  };

  // Functions to interact with local storage
  const saveToLocalStorage = (currentUser: string, authToken: string): void => {
    localStorage.setItem(CURRENT_USER_KEY, currentUser);
    localStorage.setItem(AUTH_TOKEN_KEY, authToken);

    // Expiration set to an hour
    const expiresAt = Date.now() + 60 * 60 * 1000;
    localStorage.setItem("AuthTokenExpiry", expiresAt.toString());
  };

  const clearLocalStorage = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EXPIRATION_KEY);
  };

  const retrieveFromLocalStorage = (): IAuthInfo => {
    const loggedInUser = localStorage.getItem(CURRENT_USER_KEY);
    const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const expirationTime = localStorage.getItem(AUTH_EXPIRATION_KEY);

    if (expirationTime && Date.now() > Number(expirationTime)) {
      clearLocalStorage();
      return { currentUser: null, authToken: null };
    }

    return {
      currentUser: loggedInUser,
      authToken: authToken,
    };
  };

  const isAuthenticated = (): boolean => {
    return !!authInfoState.currentUser && !!authInfoState.authToken;
  };

  // Concrete AuthInfo implementation
  const [authInfoState, setAuthInfoState] = useState<IAuthInfo>(
    retrieveFromLocalStorage()
  );

  // Concrete IAuthActions implementation
  const authActions: IAuthActions = {
    updateUserInfo,
    clearUserInfo,
    isAuthenticated,
  };

  // Concrete context that the AuthContext.Value will be set to
  const contextValue: IAuthContext = {
    ...authInfoState,
    ...authActions,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
