import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { NetflixLogo,NetflixAvatar} from "../index";
import { useStyles } from "./navigation.style";
import { useActiveUser, useFilter } from "shared/hooks";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useFormik } from "formik";


interface SearchFormFormat {
  search:string
}

const  initialValues:SearchFormFormat = {
  search:""
}


export const Navigation:FC = () => {

  const [navState,setNavState] = useState(false)
  const {activeUser} = useActiveUser()
  const {setActiveFilter} = useFilter()
  const {values,handleSubmit,handleChange} = useFormik<SearchFormFormat>({
    initialValues,
    onSubmit,
  })
  
  function onChange(e:ChangeEvent<HTMLInputElement>) {
    // setActiveFilter(values.search)
    handleChange(e)
  }

  function onSubmit() {
    setActiveFilter(values.search)
  }

  const navBarStateHandler = () => {
    if(window.scrollY > 50) {
      setNavState(true)
    } else {
      setNavState(false)
    }
  }

  // console.log(navState)
  
  useEffect (() => {
    window.addEventListener("scroll",navBarStateHandler)
    return () => window.removeEventListener("scroll",navBarStateHandler)
  },[])
  const classes = useStyles()


  return (
    <nav className={`${classes.nav} ${navState?classes.nav_black:undefined}`}>
      <div className={classes.nav_content}>
        <NetflixLogo className={classes.nav_logo}/>
        <form onSubmit={handleSubmit}  className={classes.search_form}>
          <input name="search" onChange={(e) => onChange(e)} type="text" placeholder="Search"/>
          <button type="submit" className={classes.search_btn} data-testid="search" ><FaMagnifyingGlass/></button>
        </form>
       
        <NetflixAvatar className={classes.nav_avatar} avatarImage={activeUser.avatar} />
      </div>
    </nav>
  )
}

