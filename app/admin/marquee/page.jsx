"use client";
import CrudPage from "@/components/admin/CrudPage";
export default function MarqueePage() {
  return <CrudPage title="Hərəkətli strip" endpoint="/api/marquee"
    columns={[
      { key: 'text_az', label: 'Mətn (AZ)' },
      { key: 'text_en', label: 'Mətn (EN)' },
      { key: 'style', label: 'Stil' },
      { key: 'sort_order', label: 'Sıra' },
      { key: 'is_active', label: 'Aktiv', render: r => r.is_active ? '✓' : '—' },
    ]}
    fields={[
      { key: 'text_az', label: 'Mətn (AZ)', full: true },
      { key: 'text_en', label: 'Mətn (EN)', full: true },
      { key: 'style', label: 'Stil (text, display, separator)' },
      { key: 'sort_order', label: 'Sıra', type: 'number' },
      { key: 'is_active', label: 'Aktiv', type: 'checkbox' },
    ]}
  />;
}
