import React, { FC, FormEvent, useState} from "react";
import { CategoryFilter, Slider } from "../../shared/Components";
import { MdOutlineAttachMoney } from "react-icons/md";
import { Button, Card} from "@chakra-ui/react";
import { maxValue } from "../../data";
import { usePriceTarget } from "../../shared/hooks";
import { useStyles } from "./product-filtering.style";



export const ProductFiltering: FC = () => {
  
  const classes = useStyles()
  const {setPriceTarget} = usePriceTarget()
  const [sliceValue,setSliceValue] = useState<number>(maxValue.productPrice)

  const submitHandler = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPriceTarget(sliceValue)
  }

  return (
    <Card className={classes.productContainer}>
        <form className={classes.formContainer} action="submit" onSubmit={(e) => submitHandler(e)}>
          <Slider sliderTitle="Price Filter"  minValue={0} sliderValue={sliceValue} setSliceValue={setSliceValue} maxValue={maxValue.productPrice} step={1}  markIcon={MdOutlineAttachMoney}/>
          <div>
            <Button type="submit" colorScheme="blue">Filter</Button>
          </div>
        </form>
        <CategoryFilter/>
    </Card>
  );
};
