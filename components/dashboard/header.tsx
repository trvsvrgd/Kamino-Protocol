"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Settings, User, ChevronDown, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Layers className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">
              Kamino Protocol
            </h1>
            <p className="text-xs text-muted-foreground">AI/ML Platform Dashboard</p>
          </div>
        </div>

        <nav className="ml-8 hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={
                pathname === "/"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Overview
            </Button>
          </Link>
          <Link href="/monitoring">
            <Button
              variant="ghost"
              size="sm"
              className={
                pathname === "/monitoring"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              Monitoring
            </Button>
          </Link>
          <Link href="/finops">
            <Button
              variant="ghost"
              size="sm"
              className={
                pathname === "/finops"
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground"
              }
            >
              FinOps
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            Governance
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-border bg-secondary text-foreground"
            >
              Production
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Production</DropdownMenuItem>
            <DropdownMenuItem>Staging</DropdownMenuItem>
            <DropdownMenuItem>Development</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1 top-1 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-border"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
