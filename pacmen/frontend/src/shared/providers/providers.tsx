"use client";
import { useEffect } from "react";

import { UserSession } from "../types";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RecoilRoot } from "recoil";

import { AudioBtn, NetworkSignal } from "../components";

import { MediaProvider } from "../components/media-provider";

const queryClient = new QueryClient();


export function Providers({ children }: { children: React.ReactNode }) {


  useEffect(() => {
    const saveSessionBeforeUnload = () => {
      const session = UserSession.getInstance()
      session.saveInSessionStorage()
    }
    console.log("adding beforeunload listener for session")
    window.addEventListener("beforeunload", saveSessionBeforeUnload)

    return (() => {
      console.log("removing beforeunload listener for session")
      window.removeEventListener("beforeunload", saveSessionBeforeUnload)
    })
  },[])

  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
      <div className={"page_module"}>
          <AudioBtn />
          <NetworkSignal />
        </div>
        <ChakraProvider>
          <MediaProvider/>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
