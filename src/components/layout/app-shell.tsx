"use client";

import { usePathname } from 'next/navigation';
import {
  Zap,
  LayoutDashboard,
  Wand2,
  Vote,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { ConnectWallet } from '../connect-wallet';
import { Button } from '../ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/apy-optimizer')) return 'APY Optimizer';
    if (pathname.startsWith('/governance')) return 'Governance';
    return 'YieldZenith';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0 text-primary-foreground hover:bg-sidebar-accent">
                <Zap className="size-5" />
              </Button>
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold tracking-tight text-sidebar-foreground">
                  YieldZenith
                </h2>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard')}>
                    <a>
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/apy-optimizer" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/apy-optimizer')}>
                    <a>
                      <Wand2 />
                      <span>APY Optimizer</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/governance" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/governance')}>
                    <a>
                      <Vote />
                      <span>Governance</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <h1 className="text-xl font-semibold tracking-tight">{getPageTitle()}</h1>
            <div className="flex items-center gap-4">
              <ConnectWallet />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
