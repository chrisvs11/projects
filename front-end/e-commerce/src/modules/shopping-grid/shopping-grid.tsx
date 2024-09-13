import React, { FC, useEffect, useState } from "react";
import { SaleCard } from "../../shared/Components";
import { Inventory, SellingItem, maxValue } from "../../data";
import { useStyles } from "./shopping-grid.style";
import { ShoppingGridProps } from "../../types";
import { useShownInventoryState, useCategoryTarget,useProductTarget} from "../../shared/hooks";
import { ErrorCard } from "../error-card/error-card";



export const ShoppingGrid:FC<ShoppingGridProps> = ({targetPrice = maxValue.productPrice}) => {
  
  const classes = useStyles()
  const {shownInventory,setShownInventory} = useShownInventoryState()
  const {categories} = useCategoryTarget()
  const {productTarget} = useProductTarget()

  
  
  useEffect(() => {
    filterInventoryByPrice(targetPrice,filterInventorByCategory(categories,filterInventoryByProduct(productTarget)))
    // console.log(targetPrice)
  },[targetPrice,categories,productTarget])

  const filterInventoryByPrice = (price:number,inventory:SellingItem[]) => {
    const filteredInventory = inventory.filter((item) => {
      // console.log(item.productPrice, price,item.productPrice <= price)
      return item.productPrice <= price
    })
    filteredInventory.sort((a,b)=> -a.productPrice+b.productPrice)

    setShownInventory(filteredInventory)
  }

  const filterInventorByCategory = (categories:string[],filteredInventory:SellingItem[]):SellingItem[] => {
    let filterInventory = filteredInventory
    if(categories.length > 0){
     filterInventory = Inventory.filter(({category})=>{
        return categories.some(target => target === category)
      })
    } 
    return filterInventory
   
  } 

  const filterInventoryByProduct = (product:string):SellingItem[] => {
      let productFilteredInventory:SellingItem[] = Inventory
      console.log(product)
      if(product.length>0){
        productFilteredInventory = Inventory.filter(({productName}) => productName.toLowerCase().includes(product.toLowerCase()))
      }

      return productFilteredInventory
  }

    return (
      <div style={{width:"100%",display:"flex"}}>
        <div className={classes.shoppingGrid}>
          {shownInventory.map(({productName,productImage,productPrice,tags,id,category}) => <SaleCard key={`item - ${id}`} productImage={productImage} productName={productName} productPrice={productPrice} tags={tags} category={category} id={id}/>)}
          {shownInventory.length===0 && <ErrorCard/>}
        </div>
        
      </div>
      
       
    )
}