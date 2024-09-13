import React, { FC, useEffect } from "react";
import { Inventory } from "../../data";
import { SelectProps } from "../../types";
import { Select } from "@chakra-ui/react";

const categories:string[] = []

for(const item of Inventory){
    if(categories.every((value) => value !== item.category)){
        categories.push(item.category)
    }
}


export const SelectCategories:FC<SelectProps>= (props) => {
    
    return(
        <Select placeholder={props.placeholder} textAlign={"center"}>
            {categories.map(category => (
                <option value={category} style={{fontWeight:"bolder"}} key={`${category}`}>{category}</option>
            ))}
        </Select>
    )
}