import { SellingItem } from "../data";

export interface CartItem extends SellingItem {
    quantity:number
}