import { Card,Image } from "@chakra-ui/react";
import React, { FC } from "react";


export const OtherPage:FC = () => {


    return (
        <Card borderTop={"5px solid red"} borderBottom={"5px solid red"}  borderRadius="none" padding={"50px"} display="flex" boxShadow="rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px">
            <h1>I am sorry...the unicorns are working on this page, please be patient</h1>
            <Image src="https://unstablegames.com/cdn/shop/files/ug-contact.png?v=1715120332&width=3200"/>
            <h1>and have a magical day....Continue shopping instead</h1>
        </Card>
    )
}

