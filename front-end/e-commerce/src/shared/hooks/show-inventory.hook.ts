import { useRecoilState } from "recoil";

import { ShownInventoryState } from "../states";


export const useShownInventoryState = () => {
    const [shownInventory,setShownInventory] = useRecoilState(ShownInventoryState)

    return{
        shownInventory,
        setShownInventory
    }
}
