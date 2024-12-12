import { SessionStorage } from "../aux-classes";

export interface SessionInfo {
  username: string;
  lobbyId: string;
  gameId: string;
  playerId:string;
  lobbyHost:string;
}

const emptySession: SessionInfo  = {
  username:"",
  lobbyId:"",
  gameId:"",
  playerId:"",
  lobbyHost:"",
}

export class Session {
  private session: SessionInfo;

  constructor() {
    this.session = emptySession
  }

  public clearSession () {
    this.session = {...emptySession,username:this.session.username}
  }

  public startSession(username: string) {
    this.session = { ...this.session, username };
    console.log(`User ${username} has started session`);
    return username
  }

  public endSession() {
    this.session = emptySession;
  }

  public joinLobby(lobbyId: string) {
    console.log("session", this.session)
    this.session =  {...this.session,lobbyId} 
    return lobbyId
  }

  public leaveLobby() {
    console.log("leaving lobby",this.session?.lobbyId)
    this.session = {...this.session, lobbyId: ""} 
  }

  public joinGame(gameId:string) {
    this.session = {...this.session,gameId} 
    return gameId
  }

  public setPlayerId(playerId:string) {
    this.session = {...this.session,playerId} 
    return playerId
  }

  public setLobbyHost(lobbyHost:string) {
    this.session = {...this.session,lobbyHost} 
    return lobbyHost
  }

  public leaveGame() {
    console.log("leaving lobby",this.session?.gameId)
    this.session =  {...this.session, gameId: ""} 
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
        : emptySession
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

