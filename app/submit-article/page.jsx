import { getMenuPages, sql } from '@/lib/db';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ArticleSubmissionForm from '@/components/ArticleSubmissionForm';

export const metadata = { title: 'Məqalə göndər · ADDA Konfrans' };
export const dynamic = 'force-dynamic';

export default async function SubmitArticlePage() {
  const [menuPages, sections] = await Promise.all([
    getMenuPages(),
    sql`SELECT * FROM sections WHERE is_active = true ORDER BY sort_order, number`.catch(() => []),
  ]);
  return (
    <>
      <PublicHeader menuPages={menuPages} />
      <ArticleSubmissionForm sections={sections} />
      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
