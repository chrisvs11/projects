import { useRecoilState } from "recoil";
import { CategoryTargetState } from "../states";

export const useCategoryTarget = () => {
    const [categories,setCategories] = useRecoilState(CategoryTargetState)

    return{
        categories,
        setCategories
    }
}

