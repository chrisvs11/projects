import { FC } from "react";

interface NetflixAvatarProps {
  className?:string
  avatarImage?:string
}

export const NetflixAvatar:FC<NetflixAvatarProps> = ({className,avatarImage}) => {


  return(
    <img tabIndex={0} className={className} src={avatarImage} data-testid="avatar" alt="avatar logo"/>
  )
}