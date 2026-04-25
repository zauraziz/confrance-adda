"use client";
import CrudPage from "@/components/admin/CrudPage";

export default function ParticipantsPage() {
  return <CrudPage
    title="İştirakçılar (Qeydiyyat)"
    endpoint="/api/participants"
    columns={[
      { key: 'full_name', label: 'Ad Soyad' },
      { key: 'email', label: 'E-poçt' },
      { key: 'organization', label: 'Təşkilat' },
      { key: 'country', label: 'Ölkə' },
      { key: 'participation_type', label: 'İştirak növü', render: r =>
        r.participation_type === 'onsite' ? '🏢 Əyani' :
        r.participation_type === 'online' ? '💻 Onlayn' : '🔄 Hər ikisi'
      },
      { key: 'status', label: 'Status', render: r =>
        r.status === 'confirmed' ? '✅ Təsdiqlənib' :
        r.status === 'rejected' ? '❌ Rədd edilib' : '⏳ Gözləmədə'
      },
    ]}
    fields={[
      { key: 'full_name', label: 'Ad Soyad' },
      { key: 'email', label: 'E-poçt' },
      { key: 'phone', label: 'Telefon' },
      { key: 'country', label: 'Ölkə' },
      { key: 'organization', label: 'Təşkilat', full: true },
      { key: 'position', label: 'Vəzifə', full: true },
      { key: 'participation_type', label: 'İştirak növü (onsite, online, both)' },
      { key: 'status', label: 'Status (pending, confirmed, rejected)' },
      { key: 'dietary_requirements', label: 'Qida tələbləri' },
      { key: 'accommodation_needed', label: 'Otel lazımdır', type: 'checkbox' },
      { key: 'admin_notes', label: 'Admin qeydləri', type: 'textarea', rows: 3, full: true },
      { key: 'notes', label: 'İştirakçı qeydləri', type: 'textarea', rows: 3, full: true },
    ]}
  />;
}
