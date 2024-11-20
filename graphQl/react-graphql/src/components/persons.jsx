import {gql, useLazyQuery} from "@apollo/client"
import { useEffect,useState } from "react";
const FIND_PERSON = gql`

query findPersonByName($nameToSearch: String!) {
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
	const [person,setPerson] = useState(null)
	const showPerson = name => {
		getPerson({variables:{nameToSearch:name}})
	}

	useEffect(() => {
		if(result.data) {
			setPerson(result.data.findPerson)
		}
	},[result])

	if (person) {
		<div>
			<h2>{person.name}</h2>
			<div>{person.address.street}</div>
			<div>{person.address.city}</div>
			<div>{person.address.phone}</div>
			<button onClick={() => setPerson(null)}></button>
		</div>
	}
	
  return (
    <div>
      <h2>Persons</h2>
      {persons.map((person) => (
        <div key={person.id} onClick={() => {showPerson(person.name)}}>
          {person.name} {person.phone}
        </div>
      ))}
    </div>
  );
};
