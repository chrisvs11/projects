import { useRecoilState } from "recoil";
import { AuthState } from "../states";


export const useAuthState = () => {

    const [auth,setAuth] = useRecoilState(AuthState)

    return {
        auth,
        setAuth
    }
}