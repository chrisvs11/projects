
import React, { FC, useCallback, useState } from "react";
import { USERDATABASE,AVATARDATABASE } from "shared/database";
import { useStyle } from "./sing-up.style";
import { Button, NetflixAvatar } from "shared/components";
import { useNavigate } from "react-router-dom";
import {  useFormik } from "formik";
import User from "types/user.type";
import * as Yup from "yup"
import { useActiveUser } from "shared/hooks";

interface SignUpFormValueFormat {
  email:"",
  password:"",
  confirmPassword:""
}

const initialValues:SignUpFormValueFormat ={
  email:"",
  password:"",
  confirmPassword:""
}

const validationSchema = Yup.object<SignUpFormValueFormat>().shape({
  email:Yup.string()
    .min(2,"Too Short")
    .required("Email Required"),
  password:Yup.string()
    .min(6,"Too short, should be at least 6 characters long")
    .max(12, "Too long, should be no more than 12 characters")
    .required("Password Required"),
  confirmPassword:Yup.string()
    .oneOf([Yup.ref(`password`)],"Passwords must match")
    .required("Cannot be blank")
})

export const SignUpScreen:FC = () => {
  const classes = useStyle()
  const [user,setUser] = useState<User|null>(null)
  const [emailAvailability,setEmailAvailability] = useState(true)
  const [avatarScreenState,setAvatarScreenState] = useState(false)
  const navigate = useNavigate()
  const [focusedAvatar,setFocusedAvatar] = useState<number|null>(null)
  const {setActiveUser} = useActiveUser()
  const {values,handleSubmit,errors,touched,handleChange} = useFormik<SignUpFormValueFormat>({
    initialValues,
    validationSchema,
    onSubmit
  })

  const handleFocusedAvatar =useCallback((index:number) => {
    setFocusedAvatar(index)
  },[])

  const checkEmailAvailability = useCallback((email:string):boolean => {

    if(USERDATABASE.some(user=>user.email === email)){
      console.log(user?.email === email)
      return false
    } else {
      return true
    }

  },[user?.email])

  function onSubmit() {
    if(checkEmailAvailability(values.email)){
      setUser({email:values.email,password:values.password,avatar:""})
      setAvatarScreenState(true)
    } else {
      console.log(emailAvailability)
      setEmailAvailability(false)
      console.log(emailAvailability)
    
    }
  }

  const addActiveUserToDatabase = useCallback( () => {

    if(focusedAvatar! >= 0){
      const setAvatar:string = AVATARDATABASE[focusedAvatar!].avatarImage
      setActiveUser({...user!,avatar:setAvatar})
      navigate("/home")
    }

  },[focusedAvatar,navigate,setActiveUser,user])


  return(

    <div>
      {!avatarScreenState?(
        <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input  name = "email" type="email" placeholder="Email Address" value={values.email} onChange={(e) => handleChange(e)}/>
        {(touched.email)? <div className={classes.errorBorder}>{errors.email}</div>:undefined}
        {!emailAvailability ? <div className={classes.errorBorder}>Email not available</div> : undefined}
        <input name = "password" type="text" placeholder="Password" value={values.password} onChange={(e) => handleChange(e)} />
        {touched.password? <div className={classes.errorBorder} >{errors.password}</div>:undefined}
        <input name = "confirmPassword" type="text" placeholder="Confirm Password" value={values.confirmPassword} onChange={(e) => handleChange(e)} />
        {touched.confirmPassword? <div className={classes.errorBorder}>{errors.confirmPassword}</div>:undefined}
        <Button btnText="Next" btnClassName={classes.next_btn} type="submit"/>
      </form>
      ):(
        <div className={classes.avatar_body}>
          <h1>Pick Your Avatar</h1>
          <div className={classes.avatar_container}>
            {AVATARDATABASE.map((avatar,i) => 
            <div className={focusedAvatar===i?classes.focused:"" } key={`avatar - ${i}`} onClick={()=>handleFocusedAvatar(i)}>
              <NetflixAvatar className={`${classes.avatar} ${focusedAvatar===i?classes.focused:""}`} avatarImage={avatar.avatarImage} />
            </div>)}
          </div>  
          <Button btnText="Confirm" btnClassName={classes.avatar_btn} onClick={()=>addActiveUserToDatabase()}/>        
        </div>
      
        
      )}
  
    </div>

  )

}