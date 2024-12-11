import { SessionStorage } from "../aux-classes";

export interface SessionInfo {
  username: string;
  lobbyId?: string;
  gameId?: string;
}

export class Session {
  private session: SessionInfo | null;

  constructor() {
    this.session = null;
  }

  public startSession(username: string) {
    this.session = { username };
    console.log(`User ${username} has started session`);
    return username
  }

  public endSession() {
    this.session = null;
  }

  public joinLobby(lobbyId: string) {
    console.log("session", this.session)
    this.session = this.session ? {...this.session,lobbyId} : null
    return lobbyId
  }

  public joinGame(gameId:string) {
    this.session = this.session ? {...this.session,gameId} :null 
    return gameId
  }

  public getSession () {
    return this.session
  }

  public saveInSessionStorage () {
    console.log("saved in session storage...", this.session)
    SessionStorage.setValue("session",JSON.stringify(this.session))
  }

  public loadInSessionStorage () {
    const sessionData = SessionStorage.getValue("session")
    console.log("loading data...", sessionData)
    this.session = sessionData 
        ? JSON.parse(sessionData) as SessionInfo
        : null
  }

}


//Create the singleton class
export class UserSession {
    private static instance:Session | null

    private constructor() {
        if(!UserSession.instance) {
            UserSession.instance = new Session()
            UserSession.instance.loadInSessionStorage()
        }

        return UserSession.instance
    }

    public static  getInstance(): Session {
        if(!UserSession.instance) {
            UserSession.instance = new Session()
            UserSession.instance.loadInSessionStorage()
        }

        return UserSession.instance
    }

}

