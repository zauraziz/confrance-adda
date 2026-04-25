'use client';
import CrudPage from '@/components/admin/CrudPage';

export default function AdminSchedule() {
  return <CrudPage
    title="Cədvəl"
    endpoint="/api/sessions"
    columns={[
      { key: 'day_number', label: 'Gün', render: r => `Gün 0${r.day_number}` },
      { key: 'start_time', label: 'Vaxt' },
      { key: 'title_az', label: 'Başlıq' },
      { key: 'room', label: 'Otaq' },
    ]}
    fields={[
      { key: 'day_number', label: 'Gün (1, 2, 3)', type: 'number' },
      { key: 'start_time', label: 'Başlama vaxtı (HH:MM)' },
      { key: 'duration', label: 'Müddət (dəq)', type: 'number' },
      { key: 'title_az', label: 'Başlıq (AZ)', full: true },
      { key: 'title_en', label: 'Başlıq (EN)', full: true },
      { key: 'room', label: 'Otaq / məkan' },
      { key: 'speaker_id', label: 'Spiker ID', type: 'number' },
      { key: 'description_az', label: 'Təsvir (AZ)', type: 'textarea', full: true },
      { key: 'description_en', label: 'Təsvir (EN)', type: 'textarea', full: true },
      { key: 'sort_order', label: 'Sıralama', type: 'number' },
      { key: 'is_featured', label: 'Featured sessiya', type: 'checkbox' },
    ]}
  />;
}
