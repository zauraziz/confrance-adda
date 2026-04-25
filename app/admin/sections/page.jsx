"use client";
import CrudPage from "@/components/admin/CrudPage";
export default function SectionsPage() {
  return <CrudPage title="Konfrans bölmələri" endpoint="/api/sections"
    columns={[
      { key: 'number', label: '#' },
      { key: 'title_az', label: 'Başlıq (AZ)' },
      { key: 'chairs', label: 'Həmsədrlər' },
    ]}
    fields={[
      { key: 'number', label: 'Nömrə', type: 'number' },
      { key: 'title_az', label: 'Başlıq (AZ)', full: true },
      { key: 'title_en', label: 'Başlıq (EN)', full: true },
      { key: 'title_ru', label: 'Başlıq (RU)', full: true },
      { key: 'description_az', label: 'Əhatə edir (AZ)', type: 'textarea', rows: 4, full: true },
      { key: 'description_en', label: 'Covers (EN)', type: 'textarea', rows: 4, full: true },
      { key: 'description_ru', label: 'Темы (RU)', type: 'textarea', rows: 4, full: true },
      { key: 'chairs', label: 'Həmsədrlər', full: true },
      { key: 'sort_order', label: 'Sıra', type: 'number' },
      { key: 'is_active', label: 'Aktiv', type: 'checkbox' },
    ]}
  />;
}
