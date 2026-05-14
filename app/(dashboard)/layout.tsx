import { cookies } from "next/headers";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { BioAnalystSidebar } from "@/components/chat/bioanalyst-sidebar";
import { WorkbenchHeader } from "@/components/chat/workbench-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<DashboardShellFallback />}>
      <SidebarShell>{children}</SidebarShell>
    </Suspense>
  );
}

async function SidebarShell({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return <DashboardShell defaultOpen={defaultOpen}>{children}</DashboardShell>;
}

function DashboardShell({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
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
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function DashboardShellFallback() {
  return (
    <div className="flex h-screen w-full bg-white text-slate-900">
      <aside className="h-screen w-64 shrink-0 border-r border-slate-100 bg-white" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-14 shrink-0 border-b border-slate-100 bg-white" />
        <main className="min-h-0 flex-1 overflow-hidden bg-[#f7f8fd]" />
      </div>
    </div>
  );
}
