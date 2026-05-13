import Script from "next/script";
import { Suspense } from "react";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { ChatShell } from "@/components/chat/shell";
import { ActiveChatProvider } from "@/hooks/use-active-chat";

export default function Page() {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="lazyOnload"
      />
      <DataStreamProvider>
        <Suspense fallback={<div className="flex h-full" />}>
          <ActiveChatProvider>
            <ChatShell />
          </ActiveChatProvider>
        </Suspense>
      </DataStreamProvider>
    </>
  );
}
