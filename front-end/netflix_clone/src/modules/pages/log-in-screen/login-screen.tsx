import React, { FC, useCallback, useState } from "react";
import { useStyles } from "./login-screen.style";
import { Button, NetflixLogo } from "shared/components";
import { SignInScreen } from "../sign-in-screen/sign-in-screen.component";
import { useFormik } from "formik";

interface SignUpFormValuesFormat {
  email:string,

}

const initialValues:SignUpFormValuesFormat = {
  email:"",

}


export const LoginScreen: FC = () => {
  const classes = useStyles();
  const [signIn, setSignIn] = useState<boolean>(false);
  const {values,handleSubmit,handleChange} = useFormik<SignUpFormValuesFormat>({
    initialValues,
    onSubmit

  })

  function onSubmit() {

  }


  const clickHandler = useCallback(() => {
    setSignIn(true);
  },[]);


  const logoClickHandler = useCallback(() => {
      setSignIn(false)
  },[])

  return (
    <div className={classes.login_container}>
      <div className={classes.login_background_container}>
        <NetflixLogo className={classes.login_logo} onClick={logoClickHandler}/>
        {!signIn && <Button
          btnClassName={classes.login_screen_btn}
          onClick={clickHandler}
          btnText="Sign In"
        />}

        <div className={classes.login_background_gradient} />
      </div>
      <div className={classes.login_body}>
        <>
          {signIn ? (
            <SignInScreen initialValue={values.email}/>
          ) : (
            <>
              <h1>Unlimited films, TV programmes and more.</h1>
              <h2>Watch anywhere. Cancel at any time.</h2>
              <h3>
                Ready to watch? Enter your email to create or restart your
                membership
              </h3>
              <div className={classes.login_screen_input}>
                <form action="submit" onSubmit={handleSubmit}>
                  <input name="email" type="email" placeholder="Email Address" value={values.email} onChange={(e)=>handleChange(e)} />
                  <Button
                    btnText="GET STARTED"
                    btnClassName={classes.login_screen_getStarted}
                    onClick={clickHandler}
                  />
                </form>
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
};
