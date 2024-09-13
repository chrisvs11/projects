import React, { FC } from "react";
import { LinkProps } from "../../../types";
import { Link as CKLink } from "@chakra-ui/react";

import { FaFacebook, FaTwitter } from "react-icons/fa";
import { CiTwitter } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";


export const Link:FC<LinkProps> = ({linkContentText,href,styled,target,className,style}) => {

    const linksIconsHashTable:{[key:string]:any} = {
        "Facebook":<FaFacebook/>,
        "Twitter":<CiTwitter/>,
        "Instagram":<FaInstagram/>,
        "Search": <IoSearch/>
        
    }


    return(
      <div className="container">
          {styled
        ? <CKLink className={className}>{linksIconsHashTable[linkContentText]?linksIconsHashTable[linkContentText]:linkContentText}</CKLink>
        : <a target="_self" className="">{linkContentText==="Facebook"?<FaFacebook/>:linkContentText==="Twitter"?<FaTwitter/>:linkContentText==="Instagram"?<FaInstagram/>:linkContentText}</a>}
      </div>
    )
}


