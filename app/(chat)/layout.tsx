import { cookies } from "next/headers";
import Script from "next/script";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { BioAnalystSidebar } from "@/components/chat/bioanalyst-sidebar";
import { DataStreamProvider } from "@/components/chat/data-stream-provider";
import { ChatShell } from "@/components/chat/shell";
import { WorkbenchHeader } from "@/components/chat/workbench-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ActiveChatProvider } from "@/hooks/use-active-chat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="lazyOnload"
      />
      <DataStreamProvider>
        <Suspense fallback={<div className="flex h-dvh bg-sidebar" />}>
          <SidebarShell>{children}</SidebarShell>
        </Suspense>
      </DataStreamProvider>
    </>
  );
}

async function SidebarShell({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full bg-white text-slate-900">
        <BioAnalystSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <WorkbenchHeader />
          <Toaster
            position="top-center"
            theme="system"
            toastOptions={{
              className:
                "!bg-card !text-foreground !border-border/50 !shadow-[var(--shadow-float)]",
            }}
          />
          <main className="min-h-0 flex-1 overflow-hidden bg-[#f7f8fd]">
            <Suspense fallback={<div className="flex h-full" />}>
              <ActiveChatProvider>
                <ChatShell />
              </ActiveChatProvider>
            </Suspense>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
