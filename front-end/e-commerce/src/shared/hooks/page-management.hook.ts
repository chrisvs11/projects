import { GlobalPageState } from "../states";
import { useRecoilState } from "recoil";


export const usePageState = () => {

    const [page,setPage] = useRecoilState(GlobalPageState)

    return {
        page,
        setPage
    }
}