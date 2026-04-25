import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }) {
  let admin = null;
  try {
    const session = await getSession();
    admin = session?.admin || null;
  } catch { admin = null; }

  if (!admin) return <>{children}</>;
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
