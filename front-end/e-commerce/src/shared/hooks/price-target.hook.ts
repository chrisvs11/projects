import { useRecoilState } from "recoil";
import { PriceTargetValueState } from "../states";

export const usePriceTarget = () => {
    const [priceTarget,setPriceTarget] = useRecoilState(PriceTargetValueState)

    return{
        priceTarget,
        setPriceTarget
    }
}

