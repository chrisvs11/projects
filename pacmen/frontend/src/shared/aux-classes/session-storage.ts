export class SessionStorage {
  
  constructor() {}

  static setValue = (key: string, value: string):boolean => {
    if (typeof window === "undefined") return false;
    sessionStorage.setItem(key, value);
    return true
  };

  static getValue = (key: string): string => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem(key) || "";
  };

  static eliminateValue = (key:string):boolean => {
    if (typeof window === "undefined") return false
    sessionStorage.removeItem(key)
    return true
  }

}