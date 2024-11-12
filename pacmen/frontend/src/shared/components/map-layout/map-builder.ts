import outsideCornerImage from "./tiles-sprites/double-wall-corner-sprite.png"

import outsideStraightImage from "./tiles-sprites/double-wall-straight-sprite.png"

import insideCornerImage from "./tiles-sprites/single-wall-corner-sprite.png"

import insideStraightImage from "./tiles-sprites/single-straight-wall-sprite.png"

import sharpCornerImage from "./tiles-sprites/double-wall-sharp-corner-sprite.png"

import endWallImageLeft from "./tiles-sprites/double-wall-entrance-sprite.png"

import endWallImageRight from "./tiles-sprites/double-wall-end-right.png"

import pelletImage from "./tiles-sprites/pellet-sprite.png"

import powerUpImage from "./tiles-sprites/powerUp-sprite.png"

import { MapTile } from "@/shared/types"

interface backgroundProperties {
  path:string,
  rotation:number
}


export function getCellBackground(cell:MapTile):backgroundProperties {
  if(cell.item){
    return getItemBackground(cell.item)
  } else if (cell.wallType) {
    return getWallBackground(cell.wallType)
  }

  return {path:"",rotation:0}
}


function getItemBackground(item:string|undefined):backgroundProperties{
  switch(item){
    case("🟡"):
      return {path:pelletImage.src,rotation:0}
    case("🔋"):
      return {path:powerUpImage.src,rotation:0}
    default:
      return {path:"",rotation:0}
  }
}


function getWallBackground(wallType:string|undefined):backgroundProperties {
  switch(wallType) {
    case("LC"):
      return {path:outsideCornerImage.src,rotation:270}
    case("RC"):
      return {path:outsideCornerImage.src,rotation:0}
    case("CL"):
      return {path:outsideCornerImage.src,rotation:90}
    case("CR"):
      return {path:outsideCornerImage.src,rotation:180}
    case("| "):
      return {path:outsideStraightImage.src,rotation:180}
    case(" |"):
      return {path:outsideStraightImage.src,rotation:0}
    case("T-"):
      return {path:outsideStraightImage.src,rotation:270}
    case("B-"):
      return {path:outsideStraightImage.src,rotation:90}
    case("lc"):
      return {path:insideCornerImage.src,rotation:270}
    case("cl"):
      return {path:insideCornerImage.src,rotation:90}
    case("rc"):
      return {path:insideCornerImage.src, rotation:0}
    case("cr"):
      return {path:insideCornerImage.src, rotation:180}
    case("i|"):
      return {path:insideStraightImage.src,rotation:0}
    case("|i"):
      return {path:insideStraightImage.src,rotation:180}
    case("t-"):
      return {path:insideStraightImage.src,rotation:90}
    case("b-"):
      return {path:insideStraightImage.src,rotation:270}
    case("SR"):
      return {path:sharpCornerImage.src,rotation:0}
    case("SL"):
      return {path:sharpCornerImage.src,rotation:270}
    case("RS"):
      return {path:sharpCornerImage.src,rotation:180}
    case("LS"):
      return {path:sharpCornerImage.src,rotation:90}
    case("E-"):
      return {path:endWallImageLeft.src,rotation:0}
    case("-E"):
      return {path:endWallImageRight.src,rotation:0}
    default:
      return {path:"",rotation:0}
  }
}



