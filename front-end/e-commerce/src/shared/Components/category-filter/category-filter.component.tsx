import { Button, Card } from "@chakra-ui/react";
import React, { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useShownInventoryState,useCategoryTarget} from "../../hooks";
import { useStyles } from "./category-filter.style";
import { GrPowerReset } from "react-icons/gr";

export const CategoryFilter: FC = () => {
  const classes = useStyles();
  const { shownInventory } = useShownInventoryState();
  const {categories,setCategories} = useCategoryTarget(); 
  const [currentCategory, setCurrentCategory] = useState<string[]>([]);
  const [isOpen,setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const uniqueTags = new Set<string>();
    shownInventory.map(item => {
      if(!uniqueTags.has(item.category)){
        uniqueTags.add(item.category)
      }
    })
    const tagsArray = Array.from(uniqueTags);

    setCurrentCategory([...tagsArray]);
  }, [shownInventory]);

  const resetCategories = useCallback(() => {
    setCategories([])
    setIsOpen(false)
  },[])
  
  const clickHandler = (tag:string) => {
    setCategories(prev => [tag,...prev])
    setIsOpen(true)
    
  }

  return (
    <Card p={"5px"}>
      <p className={classes.tagContainerTitle}>Category Filter</p>
      <div className={classes.tagsGridContainer}>
        {currentCategory.map((tag) => (
          <Button size={"sm"} className={classes.category}  onClick={() => clickHandler(tag)} colorScheme="red" key={`key-${tag}`}>
            {tag}
          </Button>
        ))}
      </div>
      <div>
        {isOpen&&<Button colorScheme="blue" leftIcon={<GrPowerReset/>} onClick={() => resetCategories()}>Reset Categories</Button>}
      </div>
     
    </Card>
  );
};
