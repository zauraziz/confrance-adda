import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export default async function AdminLayout({ children }) {
  // Auth artıq middleware tərəfindən yoxlanılır,
  // amma admin obyektini layout-a vermək üçün təkrar oxuyuruq
  const session = await getSession();
  if (!session?.admin) redirect('/admin/login');

  return <AdminShell admin={session.admin}>{children}</AdminShell>;
}
