import React, { FC, useState } from "react";
import { useStyle } from "./sign-in-screen.styles";
import { Button } from "shared/components";
import { useFormik } from "formik";
import { useActiveUser } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import { SignUpScreen } from "../sign-up-screen/sign-up-screen";

interface SignInScreenProps {
  initialValue:string
}

interface SignUpFormFormat {
  email:string,
  password:string
}

export const SignInScreen:FC<SignInScreenProps> = ({initialValue}) => {

  const classes = useStyle()
  const [error,setError] = useState(false)
  const {changeActiveUser} = useActiveUser()
  const navigate = useNavigate()
  const [signUp,setSignUp] = useState(false)

  
const initialValues:SignUpFormFormat = {
  email: initialValue,
  password:""
}

const {values,handleSubmit,handleChange} = useFormik<SignUpFormFormat>({
  initialValues,
  onSubmit,
})


function onSubmit() {

  setError(changeActiveUser({email:values.email,password:values.password,avatar:""}))
  if(!error){
    navigate("/home")
  }
  
  
}

  return (
    <div className={classes.signUp_screen}>
        {signUp ? (
          <SignUpScreen/>) : (
          <form action="submit" onSubmit={handleSubmit}> 
            <h1>Sign In</h1>
            <input name="email" placeholder="Email" type="email" value={values.email} onChange={(e)=>handleChange(e)}/>
            <input name="password" placeholder="Password" type="password" value={values.password} onChange={(e) => handleChange(e)}/>
            {error && <div>Wrong password</div>}
            <Button btnText="Sign In" btnClassName={classes.signUp_btn} type="submit"/>
            <h4>
              <span className={classes.signUp_gray}>New to netflix? </span>
              <a onClick={()=>setSignUp(true)}>Sign Up now</a>
            </h4>
          </form>
          )}
    </div>
  )
}