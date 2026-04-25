"use client";
import CrudPage from "@/components/admin/CrudPage";
export default function PartnersPage() {
  return <CrudPage title="Tərəfdaşlar" endpoint="/api/partners"
    columns={[
      { key: 'name', label: 'Ad' },
      { key: 'category', label: 'Kateqoriya' },
      { key: 'sort_order', label: 'Sıra' },
    ]}
    fields={[
      { key: 'name', label: 'Ad', full: true },
      { key: 'logo_url', label: 'Logo URL', full: true },
      { key: 'website_url', label: 'Veb sayt', full: true },
      { key: 'category', label: 'Kateqoriya (accreditation, sponsor, media)' },
      { key: 'sort_order', label: 'Sıra', type: 'number' },
      { key: 'is_active', label: 'Aktiv', type: 'checkbox' },
    ]}
  />;
}
