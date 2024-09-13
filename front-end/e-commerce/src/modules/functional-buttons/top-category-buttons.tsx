import { Button } from "@chakra-ui/react";
import React, { FC } from "react";
import { BiListCheck } from "react-icons/bi";
import { FaListOl } from "react-icons/fa";


export const TopCategoryBtn:FC = () => {


    return(
        <Button colorScheme="darkred" leftIcon={<FaListOl/>}>Top Categories</Button> 
    )
}