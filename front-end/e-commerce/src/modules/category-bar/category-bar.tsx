import { Box, Button, Circle } from "@chakra-ui/react";
import React, { FC, useEffect } from "react";
import { TopCategoryBtn } from "../functional-buttons/top-category-buttons";
import { SearchBar } from "../../shared/Components";
import { RiRoadMapLine } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { VscRefresh } from "react-icons/vsc";
import { UseStyles } from "./category-bar.style";
import { RiShoppingCart2Line } from "react-icons/ri";
import { useGlobalCartState } from "../../shared/hooks";
import { usePageState } from "../../shared/hooks";




export const CategoryBar: FC = () => {

  const {page,setPage} = usePageState()
  const {cart,setCart} = useGlobalCartState()
  const classes = UseStyles()

  useEffect(() => {
    getQuantity()
  },[cart])

  const getQuantity = ():number => {
    let quantity:number = 0
    if(cart.length>0){
      cart.map(item => quantity+=item.quantity)
    }
    return quantity
  }

  return (
    <Box className={classes.categoryContainerWrapper} >
      <TopCategoryBtn />
      <div className={classes.searchBarContainer}>
        <SearchBar />
      </div>
      <div className={classes.iconsContainer}>
        <Button variant="link" color="black"><RiRoadMapLine/></Button>  
        <Button variant="link" color="black"><FaRegHeart/></Button>
        <Button variant="link" color="black"><VscRefresh/></Button>  
        <div style={{display:"flex"}}>
        <Button flex={"1"} variant="link" color="black" onClick={() => setPage("cart") } ><RiShoppingCart2Line/></Button>
        {cart.length > 0  && <Circle marginTop="-10px" marginLeft={"-15px"} alignSelf={"flex-start"} fontSize={"10px"} size={"15px"} bg={"yellow"}>{getQuantity()}</Circle>}
        </div>
        
      </div>
    </Box>
  );
};
