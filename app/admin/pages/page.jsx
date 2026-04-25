'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminPages() {
  return <CrudPage
    title="Səhifələr"
    endpoint="/api/pages"
    columns={[
      { key: 'title_az', label: 'Başlıq' },
      { key: 'slug', label: 'URL', render: r => `/p/${r.slug}` },
      { key: 'show_in_menu', label: 'Menyuda', render: r => r.show_in_menu ? '✓' : '—' },
      { key: 'is_published', label: 'Aktiv', render: r => r.is_published ? '✓' : '—' },
    ]}
    fields={[
      { key: 'title_az', label: 'Başlıq (AZ)', full: true },
      { key: 'title_en', label: 'Başlıq (EN)', full: true },
      { key: 'slug', label: 'URL slug (məs: viza-melumati)' },
      { key: 'sort_order', label: 'Sıralama', type: 'number' },
      { key: 'content_az', label: 'Məzmun (AZ)', type: 'textarea', rows: 12, full: true },
      { key: 'content_en', label: 'Məzmun (EN)', type: 'textarea', rows: 12, full: true },
      { key: 'meta_desc_az', label: 'Meta description (AZ)', full: true },
      { key: 'meta_desc_en', label: 'Meta description (EN)', full: true },
      { key: 'show_in_menu', label: 'Menyuda göstər', type: 'checkbox' },
      { key: 'is_published', label: 'Aktiv et', type: 'checkbox' },
    ]}
  />;
}
