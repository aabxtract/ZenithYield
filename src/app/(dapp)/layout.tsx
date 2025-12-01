import { AppShell } from '@/components/layout/app-shell';
import { YieldZenithProvider } from '@/hooks/use-yield-zenith-provider';

export default function DappLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <YieldZenithProvider>
      <AppShell>{children}</AppShell>
    </YieldZenithProvider>
  );
}
