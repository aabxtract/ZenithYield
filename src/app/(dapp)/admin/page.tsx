import { AdminPageContent } from '@/components/admin/admin-page-content';

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <AdminPageContent />
    </div>
  );
}
