"use client";
import { useEffect, useState } from "react";
import {
  NetworkState,
} from "../types";

// const RECONNECT_TIME: number = 3000;

const useNetwork = () => {
  const [state, setState] = useState<NetworkState>();

  const handleOnline = () => {
    
    setState((prev) => ({
      ...prev,
      online: true,
      since: new Date().toString(),
    }));

  };

  const handleOffline = () => {
    setState((prev) => ({ ...prev, online: false, since: "" }));
  };

  useEffect(() => {
    console.log("starting networking status")
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
 
    setState({
      since: "",
      online: navigator.onLine,
    });

    handleOnline()

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { state };
};

export default useNetwork;
