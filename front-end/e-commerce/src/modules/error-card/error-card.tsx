import { Card, Image } from "@chakra-ui/react";
import React, { FC } from "react";
import { useStyle } from "./error-card.style";

export const ErrorCard:FC = () => {
    const classes = useStyle()

    return (
        <Card className={classes.cardContainer}>
            <p className={classes.p}>We don't have anything with that price,name or category...but we have a dinosaur</p>
            <Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0m9vTfcB8nc_wDVt-hPU8tU6OvRqUR6SunQ&s" objectFit={"contain"}/>
            <p className={classes.p} >and is not for Sale!</p>
        </Card>
    )
}