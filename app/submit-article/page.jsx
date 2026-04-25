import { getMenuPages } from '@/lib/db';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';
import ArticleSubmissionForm from '@/components/ArticleSubmissionForm';

export const metadata = { title: 'Məqalə göndər · ADDA Konfrans' };

export default async function SubmitArticlePage() {
  const menuPages = await getMenuPages();
  return (
    <>
      <PublicHeader menuPages={menuPages} />
      <ArticleSubmissionForm />
      <PublicFooter content={{}} menuPages={menuPages} />
    </>
  );
}
