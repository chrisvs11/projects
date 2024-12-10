"use client";

import { ChakraProvider } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RecoilRoot } from "recoil";

import { AudioBtn, NetworkSignal } from "../components";

import { MediaProvider } from "../components/media-provider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RecoilRoot>
      <AudioBtn />
      <NetworkSignal/>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <MediaProvider/>
          {children}
        </ChakraProvider>
      </QueryClientProvider>
    </RecoilRoot>
  );
}
