'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminSpeakers() {
  return <CrudPage
    title="Spikerlər"
    endpoint="/api/speakers"
    columns={[
      { key: 'name_az', label: 'Ad' },
      { key: 'role_az', label: 'Vəzifə' },
      { key: 'country', label: 'Ölkə' },
      { key: 'slug', label: 'URL slug' },
    ]}
    fields={[
      { key: 'name_az', label: 'Ad (AZ)' },
      { key: 'name_en', label: 'Ad (EN)' },
      { key: 'role_az', label: 'Vəzifə (AZ)', full: true },
      { key: 'role_en', label: 'Vəzifə (EN)', full: true },
      { key: 'bio_az', label: 'Bioqrafiya (AZ)', type: 'textarea', rows: 6, full: true },
      { key: 'bio_en', label: 'Bioqrafiya (EN)', type: 'textarea', rows: 6, full: true },
      { key: 'country', label: 'Ölkə kodu (AZ, GB...)' },
      { key: 'slug', label: 'URL slug' },
      { key: 'photo_url', label: 'Şəkil URL', full: true },
      { key: 'linkedin', label: 'LinkedIn' },
      { key: 'twitter', label: 'Twitter' },
      { key: 'email', label: 'E-poçt' },
      { key: 'sort_order', label: 'Sıralama', type: 'number' },
      { key: 'is_featured', label: 'Önə çıxar', type: 'checkbox' },
    ]}
  />;
}
