import { Box,Button,Image } from "@chakra-ui/react";
import { FC, useCallback, useEffect } from "react";
import { useStyles } from "./page-management-bar.style";
import { PagesSwitch } from "../../types";
import { usePageState,useAuthState } from "../../shared/hooks"


const linksText:string[] = ["New","Home","About","Shop","Contact us", "Search"]

const pagesHash:{[key:string]:PagesSwitch} = {
  "New":"other",
  "Home":"login",
  "About":"other",
  "Shop":"shopping",
  "Contact us":"other",
  "Search":"other"
}


export const PageManagementBar: FC = () => {

  const classes = useStyles()
  const {page,setPage} = usePageState()
  const {auth,setAuth} = useAuthState()


  const updatePage = useCallback((linkName:string) => {
    setPage(pagesHash[linkName])
  },[page])
  


  return (
    <Box className={classes.flexWrapper}>
      <div className={classes.logoContainer}>
        <Image  boxSize={"100px"} objectFit={"contain"} src="data:image/png;base64,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" />
        <Box className={classes.eContainer}>
          e
        </Box>
        <p style={{fontWeight:"bolder", fontSize:"55px"}}>-Commerce</p>
      </div>
      <Box className={classes.pagesContainer}>
        {page!=="login" && linksText.map((linkName,i) => <Button variant="ghost" colorScheme="blue" onClick={()=>updatePage(linkName)} key={`pageManagementLink-${i}`}>{linkName}</Button>)}
      </Box>
    </Box>
  );
};
