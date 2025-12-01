import { redirect } from 'next/navigation';
import { POOLS } from '@/lib/constants';

export default function DashboardRedirectPage() {
  if (POOLS.length > 0) {
    redirect(`/dashboard/${POOLS[0].id}`);
  } else {
    // Handle case with no pools, maybe show a message
    redirect('/');
  }
}
