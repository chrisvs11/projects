interface Person {
  name:string,
}

export interface MediaDetail {
  runtime?:number
  credits?:{
    cast:Person[],
    crew:Person[]
  }
}

