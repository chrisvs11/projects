import { useRecoilState } from "recoil";

import { SearchFilterState } from "shared/states";



export const useFilter = () => {

  const [activeFilter,setActiveFilter] = useRecoilState(SearchFilterState)

  return {
    activeFilter,
    setActiveFilter,

  }
}