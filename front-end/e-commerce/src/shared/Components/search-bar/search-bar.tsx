import { Box, Button, Button as CKButton, Input, InputGroup, InputRightAddon } from "@chakra-ui/react";
import React, { FC, useCallback } from "react";
import { IoSearch } from "react-icons/io5";
import { useProductTarget } from "../../hooks";
import { useFormik } from "formik"
import { VscDebugRestart } from "react-icons/vsc";
import { useStyles } from "./search-bar.style";

interface FormValues {
  search:string
}

const initialValues:FormValues = {
  search:""
}

export const SearchBar:FC = () => {
  
  const {setProductTarget} = useProductTarget()
  const classes = useStyles()

  const onSubmit =() => {
    setProductTarget(values.search)
    values.search = ""
  }

  const {values,handleSubmit,handleChange} = useFormik<FormValues>({
    initialValues,
    onSubmit,
  })

  const resetHandler = useCallback(() => {
    setProductTarget("")
  },[])

  return(
      <form className={classes.searchBarContainer} action="submit" onSubmit={handleSubmit}>
        <InputGroup>
          <Input name="search" style={{background:"white", borderRadius:"50px 0px 0px 50px"}} placeholder="Search Products..." value={values.search} onChange={(e)=>handleChange(e)}/>
          <InputRightAddon p="0px" margin="0" borderRadius="none" cursor="pointer" background="lightgray" ><CKButton className={classes.icon} onClick={() => resetHandler()}> <VscDebugRestart/></CKButton></InputRightAddon>
        </InputGroup>
        <Box >
          <Button colorScheme={"blue"} borderRadius={"0px 50px 50px 0px"} leftIcon={<IoSearch/>}>Search</Button>
        </Box>
      </form>
  
      
  )
}