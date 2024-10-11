import { Media } from "types"

export const SearchFunction = (targetMedia:Media[]=[],filter:string):Media[] =>  {
  let results:Media[] = []
  const correctedFilter = filter.toLocaleLowerCase()

  targetMedia.forEach(media => {
    if(media.title?.toLocaleLowerCase().includes(correctedFilter) || media.name?.toLocaleLowerCase().includes(correctedFilter) || media.original_title?.toLocaleLowerCase().includes(correctedFilter)){
      results.push(media)
    }
  })
  return results 
}
