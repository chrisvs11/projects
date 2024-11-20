import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import {gql, useQuery} from "@apollo/client"
import { Persons } from "./components/persons";


const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        street
        city
      }
    }
  }
`;

function App() {

  const {data,error,loading} = useQuery(ALL_PERSONS)

  if(error) return <span style="color: red">{error}</span>

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        {loading ? <p>Loading...</p>
        : (
          <>
            <h1>GraphQL + React</h1>
            {
              data && <Persons persons={data.allPersons}/>
            }
          
          </>
        )}
      </div>
      
    </>
  );
}

export default App;
