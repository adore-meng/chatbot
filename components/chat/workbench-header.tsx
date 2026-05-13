"use client";

import { CreditCardIcon, LogOutIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const FALLBACK_USER = {
  name: "Christopher W.",
  email: "rongweikun@gmail.com",
  initials: "WR",
};

export function WorkbenchHeader() {
  const { email, initials, name } = FALLBACK_USER;
  const logoutPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/auth/logout`;

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-100 bg-white px-6">
      <div className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-slate-300" />
        <span className="font-semibold text-[13px] text-slate-900">
          New Tasks
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open user menu"
            className="flex size-8 items-center justify-center rounded-full bg-slate-950 font-bold text-[11px] text-white shadow-sm transition-transform hover:scale-105"
            type="button"
          >
            {initials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-2xl border border-slate-100 bg-white p-0 text-slate-900 shadow-[0_18px_50px_rgb(15_23_42_/_0.12)]"
          sideOffset={10}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#f3f5ff] font-bold text-[12px] text-[#6d5dfc]">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold text-[12px] text-slate-950">
                {name}
              </div>
              <div className="truncate text-[11px] text-slate-400">{email}</div>
            </div>
          </div>
          <DropdownMenuSeparator className="mx-0 my-0 bg-slate-100" />
          <div className="p-2">
            <DropdownMenuItem className="cursor-pointer rounded-xl px-2 py-2 text-[12px] text-slate-600">
              <SettingsIcon className="size-3.5 text-slate-400" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-xl px-2 py-2 text-[12px] text-slate-600">
              <CreditCardIcon className="size-3.5 text-slate-400" />
              Billing
            </DropdownMenuItem>
          </div>
          <DropdownMenuSeparator className="mx-0 my-0 bg-slate-100" />
          <div className="p-2">
            <DropdownMenuItem asChild>
              <Link
                className="flex cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-[12px] text-red-500 focus:bg-red-50 focus:text-red-500"
                href={logoutPath}
              >
                <LogOutIcon className="size-3.5" />
                Log out
              </Link>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
