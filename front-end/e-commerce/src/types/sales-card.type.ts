import { SellingItem } from "../data";

export interface SaleCardProps extends SellingItem {
    addToCart?:(item:SellingItem)=>void
}