"use client";

import { usePathname } from 'next/navigation';
import {
  Zap,
  LayoutDashboard,
  Wand2,
  Vote,
  LineChart,
  Layers,
  Shield,
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
import { useWallet } from '@/context/wallet-context';
import { ADMIN_ADDRESS } from '@/lib/constants';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { address } = useWallet();
  const isAdmin = address === ADMIN_ADDRESS;

  const getPageTitle = () => {
    if (pathname.startsWith('/pools')) return 'Staking Pools';
    if (pathname.startsWith('/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/apy-optimizer')) return 'APY Optimizer';
    if (pathname.startsWith('/governance')) return 'Governance';
    if (pathname.startsWith('/analytics')) return 'Analytics';
    if (pathname.startsWith('/admin')) return 'Admin Dashboard';
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
                <Link href="/pools" legacyBehavior passHref>
                  <SidebarMenuButton asChild isActive={pathname.startsWith('/pools') || pathname.startsWith('/dashboard')}>
                    <a>
                      <Layers />
                      <span>Pools</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/analytics" legacyBehavior passHref>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/analytics')}>
                        <a>
                        <LineChart />
                        <span>Analytics</span>
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
               {isAdmin && (
                <SidebarMenuItem>
                  <Link href="/admin" legacyBehavior passHref>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/admin')}>
                      <a>
                        <Shield />
                        <span>Admin</span>
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              )}
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
