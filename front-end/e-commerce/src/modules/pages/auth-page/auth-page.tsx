import { Box, Card, Input,Image, Button, Tooltip } from "@chakra-ui/react";
import React, { FC, FormEvent, useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { useFormik } from "formik";
import { usePageState,useAuthState} from "../../../shared/hooks";
import { USERDATABASE, User } from "../../../data";

interface FormValues {
  username:string,
  password:string
}

const initialValues:FormValues = {
  username:"",
  password:""
}


export const AuthPage:FC = () => {

  const {page,setPage} = usePageState()
  const {auth,setAuth} = useAuthState()
  const [userError,setUserError] = useState(false)
  const [passwordError,setPasswordError] = useState(false)

  const onSubmit = () => {
    setUserError(false)
    setPasswordError(false)
    const getUser:User|undefined = USERDATABASE.find( user => user.username===values.username )
    console.log(getUser)
    if(getUser){
      if(getUser.password!==values.password){
        console.log("incorrect password")
        setPasswordError(true)
      } else {
        setPage("shopping")
        setAuth(true)
      }
    } else {
      console.log("Not user found with that username")
      setUserError(true)
    }

  }

  const {values,handleSubmit,handleChange} = useFormik<FormValues>({
    initialValues,
    onSubmit
  })


  return(
  <div>
    <Box h={"60px"} bg="red" fontSize={"36px"} color="white" fontWeight="bolder" display={"flex"} justifyContent="center" alignItems="center">
        Welcome to e-commerce, best prices every day <AiOutlineGlobal/>
    </Box>
    <Card display="flex" flexDir={"row"} alignItems="center" justifyContent="space-evenly">
      <div>
        <Image src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/e-commerce-logo%2Conline-store-shop-logo%2Cbag-design-template-bba98bf891ea8c2042542ba7549110a2_screen.jpg?ts=1662913963" boxSize={"400px"} objectFit="contain"/>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} style={{display:"flex", flexDirection:"column", gap:"20px"}}>
        <div className="username section">
          <label htmlFor="username">Username:</label>
          <Input name="username" value={values.username} onChange={(e) => handleChange(e)} border={userError?"1px solid red":undefined}/>
          {userError && <div> Not user found with that username</div>}
        </div>
        <div className="password section">
          <label htmlFor="password">Password:</label>
          <Input name="password" value={values.password} onChange={(e) => handleChange(e)} border={passwordError?"1px solid red":undefined}/>
          {passwordError && <div> Incorrect Password</div>}
        </div>
        <div>
         <Button type="submit" colorScheme="red">Login</Button>
        </div>
      </form>
    </Card>
    <Tooltip hasArrow label="I add these as reference for the log in">
      <div> Users: {JSON.stringify(USERDATABASE)}</div>
    </Tooltip>
  
  </div>
  )
}