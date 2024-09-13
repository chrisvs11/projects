import React, { FC, useCallback, useEffect } from "react";
import { CartItem } from "../../../types";
import { Box, Button, Card, Image } from "@chakra-ui/react";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useStyle } from "./cart-item-card.style";
import { useGlobalCartState } from "../../hooks";

export const CardItemCard: FC<CartItem> = (props) => {
  const classes = useStyle()
  
  const {cart,setCart} = useGlobalCartState()

  const increaseProduct = useCallback(() => {
    const updatedCart = cart.map(item => {
      if(item.id === props.id){
        const newQuantity = item.quantity + 1
        return {...item,quantity:newQuantity} 
      } else {
        return item
      }
    })
    setCart(updatedCart)
  },[cart])
  
  const decreaseProduct = useCallback(() => {
    const updatedCart = cart.map(item => {
      if(item.id === props.id && item.quantity > 1){
        const newQuantity = item.quantity - 1
        return {...item,quantity:newQuantity} 
      } else {
        return item
      }
    })
    setCart(updatedCart)
  },[cart])

  const deleteProduct = useCallback(()=> {
    const updateCart = cart.filter((item) => item.id !== props.id)
    setCart(updateCart)
  },[cart])
  
  return (
    <Card
      display="flex"
      flexDir="row"
      maxW="600px"
      minW={"500px"}
      marginInline="auto"
      alignItems={"center"}
      border={"1px solid black"}
      padding={"5px"}
    >
      <Box>
        <Image src={props.productImage} objectFit="contain" boxSize={"90px"} bg={"black"} flexBasis={"80px"}/>
      </Box>
      <Box display="flex" alignContent={"center"} w="100%" justifyContent="center">
        <Box  display="flex" alignItems="center" flexDir={"column"} minW={"fit-content"} w={"100%"}>
            <div><p style={{fontWeight:"bolder"}}>Product Name:</p> {props.productName}</div>
            <div><p style={{fontWeight:"bolder"}}>Unit Price:</p> ${props.productPrice}</div>
        </Box>
        <Box  display="flex" alignItems="center" alignContent="center" gap={"15px"} justifyContent="right">
          <div style={{fontWeight:"bolder"}}>Quantity: </div>
          <Box className={classes.quantityContainer} >
            <Box className={classes.changeQuantityIcon} onClick={() => increaseProduct()} >
              <FaRegArrowAltCircleUp />
            </Box >
            <div>{props.quantity}</div>
            <Box className={classes.changeQuantityIcon} onClick={() => decreaseProduct()}>
              <FaRegArrowAltCircleDown />
            </Box>
          </Box>
          <Box display="flex">
          <div><p style={{fontWeight:"bolder"}}>Total:</p> ${props.productPrice*props.quantity}</div>
            <Button variant="ghost" onClick={() => deleteProduct()}><MdDelete/></Button>
          </Box>      
        </Box>
      </Box>
    </Card>
  );
};
