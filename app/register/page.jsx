import { getMenuPages } from "@/lib/db";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ParticipantRegistrationForm from "@/components/ParticipantRegistrationForm";
import Recaptcha from "@/components/Recaptcha";

export const metadata = {
  title: "Qeydiyyat · ADDA Konfrans",
  description: "İnnovativ Dənizçilik və Dayanıqlı İnkişaf Beynəlxalq Konfransında iştirak üçün qeydiyyat.",
};
export const revalidate = 300;

export default async function RegisterPage() {
  const menuPages = await getMenuPages();
  return (
    <>
      <PublicHeader menuPages={menuPages} />
      <Recaptcha />
      <ParticipantRegistrationForm />
      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
