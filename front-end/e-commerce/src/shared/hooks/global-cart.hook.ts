import { GlobalCartState } from "../states";
import { useRecoilState } from "recoil";


export const useGlobalCartState = () => {

    const [cart,setCart] = useRecoilState(GlobalCartState)

    return {
        cart,
        setCart
    }
}