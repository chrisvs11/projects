import React, { FC, useEffect } from "react";
import { Box, Button } from "@chakra-ui/react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useGlobalCartState, usePageState } from "../../../shared/hooks";
import { CardItemCard } from "../../../shared/Components";


export const CartPage:FC = () => {

    const {page,setPage} = usePageState()
    const {cart,setCart} = useGlobalCartState()
    let subTotal: number = 0

    useEffect(() => {
        getTotal()
    },[cart,subTotal])
    
    const getTotal = ():number  => {
        let subTotal = 0
        cart.forEach(item => subTotal+=(item.productPrice * item.quantity))
        return subTotal
    }
  
    return (
        <div style={{display:"flex", flexDirection:"column", gap:"15px"}}>
            <Box minH={"60px"} bg={"red"} color={"white"} fontSize={"35px"} fontWeight={"bolder"} display={"flex"} justifyContent={"center"} alignItems={"center"} gap={"15px"}>
              <MdOutlineShoppingCart/>Shopping Cart
            </Box>
            {cart.map(({productImage,productName,quantity,productPrice,category,tags,id}) => <CardItemCard productImage={productImage} productName={productName} productPrice={productPrice} quantity={quantity} tags={tags} category={category} id={id}/>)}
            <p>SubTotal: $ {getTotal()}</p>
            <div style={{display:"flex", justifyContent:"center", gap:"15px"}}>
              <Button colorScheme="blue" onClick={() => setPage("shopping")}>Continue Shopping</Button>
              <Button colorScheme="blue" onClick={() => setPage("other")}>Pay</Button>
            </div>
        </div>
    )
}