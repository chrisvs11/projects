import { Card, CardBody, Image, Button as CKButton } from "@chakra-ui/react";
import React, { FC } from "react";
import { TbShoppingCartPlus } from "react-icons/tb";
import { SellingItem } from "../../../data";
import { useGlobalCartState } from "../../hooks";
import { CartItem } from "../../../types";


export const SaleCard:FC<SellingItem>= (props) => {

    const {cart,setCart} = useGlobalCartState()

    const addToCart = (id:number) => {
        if(cart.some(item=>item.id===id)){
            const updatedCart = cart.map(item => {
                console.log(item.id)
                if(item.id === id){
                    const newQuantity = item.quantity + 1
                    item = {...item,quantity:newQuantity}
                    return item
                } else {
                    return item
                }
            })
            setCart(updatedCart)
        } else {
            const newItem = {...props,quantity:1}
            setCart(prev => [newItem,...prev])
        }
    }

    return(
        <Card className="sale-card container" w={"200px"} h={"250px"} display={"flex"} alignItems={"center"} boxShadow="rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px">
            <CardBody display={"grid"} w={"100%"} alignItems={"center"} h={"100%"} gap={"10px"} fontWeight={"bolder"} justifyContent={"center"} gridTemplateRows={"1fr 1fr 1fr 1fr"} gridTemplateColumns={"1fr"}>
                <Image src={props.productImage} boxSize={"100px"} objectFit={"cover"} justifySelf={"center"}/>
                <p style={{overflow:"auto", width:"100%"}}>{props.productName}</p>
                <p>${props.productPrice}</p>
                <p style={{display:"none"}}>{props.category}</p>
                <CKButton leftIcon={<TbShoppingCartPlus/>} colorScheme="red" onClick={()=>addToCart(props.id)}>Add to Cart</CKButton>
            </CardBody>
        </Card>
    )
}
