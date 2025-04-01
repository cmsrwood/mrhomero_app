import { useContext } from "react";
import { Context } from "../contexts/AuthContext";

export default function useAuth() {
    return useContext(Context);
}