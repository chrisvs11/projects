import React, { FC } from "react";
import { CategoryBar, InformationBar, PageManagementBar, ProductFiltering, PromotionBar, ShoppingGrid } from "../..";
import { usePriceTarget } from "../../../shared/hooks";
import { Box } from "@chakra-ui/react";

export const ShopPage: FC = () => {
  const {priceTarget} = usePriceTarget()

  

  
  
  return (
    <div>
      <CategoryBar />
      <PromotionBar />
      <div className="Purchase-container" style={{ display: "flex"}}> 
        <ShoppingGrid targetPrice={priceTarget}/>
        <div className="product-filtering-container" style={{width:"40%"}}>
            <ProductFiltering />
        </div>
      </div>
    </div>
  );
};
