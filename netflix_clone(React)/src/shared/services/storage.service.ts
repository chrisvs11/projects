export class StorageService {

  get usersDatabase() {
    return localStorage.get("user-database")
  }

  public getUserDatabase() {
    return localStorage.get("user-database")
  }

  public saveUserDatabase(JSONdatabase:string) {
    localStorage.setItem("user-database",JSONdatabase)
  }

  
}

const instance = new StorageService()

export default instance