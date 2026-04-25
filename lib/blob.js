import { put, del } from '@vercel/blob';
const MAX = 10 * 1024 * 1024;
export async function uploadFile(file, folder = 'uploads', kind = 'document') {
  if (!file) throw new Error('Fayl yoxdur');
  if (file.size > MAX) throw new Error('Fayl 10 MB-dan böyükdür');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const blob = await put(folder + '/' + Date.now() + '-' + safeName, file, { access: 'public', addRandomSuffix: false });
  return { url: blob.url, pathname: blob.pathname };
}
export async function deleteFile(url) {
  if (!url || !url.includes('blob.vercel-storage.com')) return;
  try { await del(url); } catch (e) { console.error('deleteFile:', e.message); }
}
