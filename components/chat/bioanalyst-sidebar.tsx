"use client";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  Clock3Icon,
  FilesIcon,
  FolderIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Recent", href: "/recent", icon: Clock3Icon },
  { label: "Community", href: "/community", icon: UsersIcon },
];

const taskItems = [
  "Analyze outliers in dose...",
  "Compare potency of co...",
  "Suggestion for chart fo...",
];

export function BioAnalystSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const ToggleIcon = isCollapsed ? PanelLeftOpenIcon : PanelLeftCloseIcon;

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-4 text-slate-900 transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isCollapsed ? "w-[4.5rem]" : "w-64"
      )}
    >
      <div className="mb-6 flex items-center justify-between gap-2 px-1">
        <Link
          className={cn(
            "flex min-w-0 items-center gap-2",
            isCollapsed && "justify-center"
          )}
          href="/"
        >
          <Image
            alt="BioAnalyst logo"
            className="size-9 shrink-0 object-contain"
            height={36}
            src="/icon/logo.svg"
            width={36}
          />
          <div className={cn("min-w-0", isCollapsed && "hidden")}>
            <div className="font-bold text-[13px] leading-tight text-slate-950">
              BioAnalyst
            </div>
            <div className="font-semibold text-[8px] text-[#6d5dfc] tracking-[0.16em]">
              AI DATA INTELLIGENCE
            </div>
          </div>
        </Link>
        <button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700",
            isCollapsed && "mx-auto"
          )}
          onClick={toggleSidebar}
          type="button"
        >
          <ToggleIcon className="size-4" />
        </button>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <SidebarNavItem
            href={item.href}
            icon={item.icon}
            isCollapsed={isCollapsed}
            key={item.label}
          >
            {item.label}
          </SidebarNavItem>
        ))}
      </nav>

      <div className="mt-5 space-y-2">
        <button
          className={cn(
            "flex h-9 w-full items-center gap-2 rounded-lg px-2 text-left font-semibold text-[12px] text-slate-800 transition-colors hover:bg-slate-50",
            isCollapsed && "justify-center"
          )}
          type="button"
        >
          <span className="flex size-4 items-center justify-center rounded-full bg-orange-100 text-orange-500">
            <SparklesIcon className="size-3" />
          </span>
          <span
            className={cn("min-w-0 flex-1 truncate", isCollapsed && "hidden")}
          >
            weikun rong&apos;s team
          </span>
          <ChevronDownIcon
            className={cn("size-3.5 text-slate-400", isCollapsed && "hidden")}
          />
        </button>

        <Link
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg bg-[#f0eaff] px-3 font-bold text-[12px] text-[#6646e8] shadow-[inset_0_0_0_1px_rgb(109_93_252_/_0.06)] transition-colors hover:bg-[#e9e1ff]",
            isCollapsed && "justify-center px-2"
          )}
          href="/"
        >
          <span className="text-sm leading-none">+</span>
          <span className={cn(isCollapsed && "hidden")}>New Task</span>
        </Link>

        <SidebarNavItem
          active
          href="/projects"
          icon={FolderIcon}
          isCollapsed={isCollapsed}
        >
          All Projects
        </SidebarNavItem>
      </div>

      <Collapsible className={cn("mt-4", isCollapsed && "hidden")} defaultOpen>
        <CollapsibleTrigger className="group flex h-8 w-full items-center gap-2 rounded-lg px-2 font-semibold text-[12px] text-slate-700 transition-colors hover:bg-slate-50">
          <ChevronRightIcon className="size-3.5 text-slate-400 transition-transform group-data-[state=open]:rotate-90" />
          <span className="flex-1 text-left">Tasks</span>
          <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
            3
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1">
          {taskItems.map((task) => (
            <Link
              className="flex h-8 items-center gap-2 rounded-lg px-2 pl-6 text-[11px] text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              href="/"
              key={task}
            >
              <FilesIcon className="size-3.5 shrink-0 text-slate-400" />
              <span className="truncate">{task}</span>
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <div
        className={cn(
          "mt-auto rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_10px_30px_rgb(15_23_42_/_0.05)]",
          isCollapsed && "flex justify-center p-2"
        )}
      >
        <div className={cn("flex gap-2", isCollapsed && "justify-center")}>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7c5cff] to-[#d8c8ff] text-white">
            <SparklesIcon className="size-3.5" />
          </div>
          <div className={cn("min-w-0", isCollapsed && "hidden")}>
            <div className="font-bold text-[12px] text-slate-900">
              Upgrade Plan
            </div>
            <p className="mt-1 text-[10px] text-slate-400 leading-snug">
              Unlock advanced analytics and more AI runs.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  active,
  children,
  href,
  icon: Icon,
  isCollapsed,
}: {
  active?: boolean;
  children: ReactNode;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isCollapsed: boolean;
}) {
  return (
    <Link
      aria-label={typeof children === "string" ? children : undefined}
      className={cn(
        "flex h-8 items-center gap-2 rounded-lg px-2 font-medium text-[12px] text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900",
        isCollapsed && "justify-center",
        active && "bg-slate-50 text-slate-900"
      )}
      href={href}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className={cn("truncate", isCollapsed && "hidden")}>
        {children}
      </span>
    </Link>
  );
}
