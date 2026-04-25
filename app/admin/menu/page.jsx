"use client";
import CrudPage from "@/components/admin/CrudPage";
export default function MenuPage() {
  return <CrudPage title="Menyu elementləri" endpoint="/api/menu"
    columns={[
      { key: 'label_az', label: 'Başlıq (AZ)' },
      { key: 'label_en', label: 'Başlıq (EN)' },
      { key: 'href', label: 'URL' },
      { key: 'position', label: 'Yer' },
      { key: 'sort_order', label: 'Sıra' },
      { key: 'is_active', label: 'Aktiv', render: r => r.is_active ? '✓' : '—' },
    ]}
    fields={[
      { key: 'label_az', label: 'Başlıq (AZ)' },
      { key: 'label_en', label: 'Başlıq (EN)' },
      { key: 'href', label: 'URL (məs: /#about, /submit-article)', full: true },
      { key: 'position', label: 'Yer (header, footer, both)' },
      { key: 'sort_order', label: 'Sıra', type: 'number' },
      { key: 'is_active', label: 'Aktiv', type: 'checkbox' },
      { key: 'open_in_new_tab', label: 'Yeni pəncərədə aç', type: 'checkbox' },
    ]}
  />;
}
