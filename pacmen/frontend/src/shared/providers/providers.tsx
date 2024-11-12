"use client";

import { CacheProvider } from "@chakra-ui/next-js";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RecoilRoot } from "recoil";
import { AudioBtn } from "../components";

const queryClient = new QueryClient();



export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <RecoilRoot>
      <AudioBtn className={"audio_btn_container"}/>
      <CacheProvider>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider>{children}</ChakraProvider>
        </QueryClientProvider>
      </CacheProvider>
    </RecoilRoot>
  );
}
