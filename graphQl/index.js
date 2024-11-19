import { ApolloServer, gql, UserInputError } from "apollo-server";

import {v1 as uuid }from "uuid"

const persons = [
  {
    name: "Midu",
    age:"23",
    phone: "034-1234567",
    street: "Calle Frontend",
    city: "Barcelona",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Youseff",
    age:"25",
    phone: "044-123456",
    street: "Avenida Fullstack",
    city: "Mataro",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
  },
  {
    name: "Itzi",
    age:"16",
    street: "Pasaje Testing",
    city: "Ibiza",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
  },
];

const typeDefs = gql`

  enum YesNo {
    YES
    NO
  }

  type Address {
    street:String
    city:String
  }

  type Person {
    name:String!
    age:Int!
    address:Address!,
    phone:String,
    canDrink:Boolean!
    id:ID!
  }
  
  type Query {
    personCount: Int!
    allPersons(phone:YesNo): [Person]!
    findPerson(name:String!):Person
  }

  type Mutation {
    addPerson(
      name:String!
      phone:String
      street:String!
      city:String!
    ):Person
    editNumber (
      name:String!
      phone:String!
    ):Person 
  }
    
`;


const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root,args) => {
      if(!args.phone) return persons

      const byPhone = person => args.phone === "YES" ? person.phone : !person.phone

      return persons.filter(byPhone)

    },
    findPerson: (root,args) => {
      const {name} = args
      return persons.find(person => person.name === name)
    }
  },
  Person: {
    canDrink: (root) => root.age > 18, 
    address: (root) => {
      return {
        street:root.street,
        city:root.city
      }
    }
  },

  Mutation: {
    addPerson:(root,args) => {
      if(persons.find(person => person.name === args.name)) {
        throw new UserInputError("Name must be unique")
      }
      const person = {...args, id:uuid()} 
      persons.push(person) //update database with new data
      return person
    },

    editNumber:(root,args) => {
      
      const personIndex = persons.findIndex(person => person.name === args.name)
     
      if(!personIndex) return null

      const person = persons[personIndex]

      const updatedPerson = {...person,phone:args.phone}

      persons[personIndex] = updatedPerson

      return updatedPerson

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})


server.listen().then(({url}) => {
  console.log (`Server ready at ${url}`)
})