import { useContext } from "react";
import { AuthContext } from "./AuthContextProvider";

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
