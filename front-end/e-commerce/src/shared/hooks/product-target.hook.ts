import { useRecoilState } from "recoil";
import { ProductTargetState } from "../states";

export const useProductTarget = () => {
    const [productTarget,setProductTarget] = useRecoilState(ProductTargetState)

    return{
        productTarget,
        setProductTarget
    }
}

