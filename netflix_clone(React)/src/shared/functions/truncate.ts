export  default function truncate(text:string,truncateNumber:number):string {
  if(text.length > truncateNumber){
    let correctedTruncateNumber = truncateNumber
    while(text.length > correctedTruncateNumber && text[correctedTruncateNumber]!==" " && text[correctedTruncateNumber]!==",") {
    correctedTruncateNumber++
    }
    return text.slice(0,correctedTruncateNumber)+ " ..."
  } else {
    return text
  }
}