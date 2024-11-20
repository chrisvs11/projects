import {gql, useLazyQuery} from "@apollo/client"

const FIND_PERSON = gql`
query findPersonByName($nameToSearch:String!) {
    findPerson {name: $nameToSearch} {
        name
        phone
        id
        address {
            street
            city
        }
    }

}

`;

export const Persons = ({ persons }) => {
    
const [getPerson,result] = useLazyQuery(FIND_PERSON)
	
  return (
    <div>
      <h2>Persons</h2>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.phone}
        </div>
      ))}
    </div>
  );
};
