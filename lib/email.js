let _resend = null;
function getResend() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  const { Resend } = require('resend');
  _resend = new Resend(key);
  return _resend;
}

const FROM = () => process.env.RESEND_FROM_EMAIL || 'noreply@example.com';

export async function sendArticleConfirmation({ to, fullName, title, lang = 'az' }) {
  const r = getResend(); if (!r) return { skipped: true };
  const subject = lang === 'az' ? 'Müraciətiniz qəbul edildi — ADDA Konfrans' : 'Your submission has been received — ADDA Conference';
  const html = `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:40px 20px;color:#0a1a3d"><div style="border-top:3px solid #c9a55a;padding-top:30px"><h1 style="color:#002366;font-weight:300;font-size:28px">${lang === 'az' ? 'Hörmətli' : 'Dear'} ${fullName},</h1><p>"<strong>${title}</strong>" ${lang === 'az' ? 'başlıqlı müraciətiniz qəbul edildi.' : 'has been submitted.'}</p><p>${lang === 'az' ? 'Elmi şura 14 iş günü ərzində cavab verəcək.' : 'The committee will respond within 14 business days.'}</p><hr style="border:none;border-top:1px solid #002366;opacity:.15;margin:30px 0"><p style="opacity:.6;font-size:13px">ADDA Konfrans Katibliyi</p></div></div>`;
  return r.emails.send({ from: FROM(), to, subject, html });
}

export async function sendArticleStatusUpdate({ to, fullName, title, status, notes, lang = 'az' }) {
  const r = getResend(); if (!r) return { skipped: true };
  const isOk = status === 'accepted';
  const subject = lang === 'az' ? (isOk ? 'Məqaləniz qəbul edildi' : 'Məqalə haqqında') : (isOk ? 'Article accepted' : 'About your article');
  const html = `<div style="font-family:sans-serif;max-width:560px;margin:auto;padding:40px 20px;color:#0a1a3d"><div style="border-top:3px solid #c9a55a;padding-top:30px"><p>${lang === 'az' ? 'Hörmətli' : 'Dear'} ${fullName},</p><p>"<strong>${title}</strong>" — <strong style="color:${isOk ? '#c9a55a' : '#dc2626'}">${isOk ? (lang === 'az' ? 'Qəbul edildi' : 'Accepted') : (lang === 'az' ? 'Rədd edildi' : 'Not accepted')}</strong></p>${notes ? '<p style="background:#f7f6f1;padding:15px;border-left:3px solid #c9a55a">' + notes + '</p>' : ''}<hr style="border:none;border-top:1px solid #002366;opacity:.15;margin:30px 0"><p style="opacity:.6;font-size:13px">ADDA Konfrans</p></div></div>`;
  return r.emails.send({ from: FROM(), to, subject, html });
}

export async function sendAdminNotification({ fullName, email, title }) {
  const r = getResend(); if (!r) return { skipped: true };
  const to = process.env.ADMIN_NOTIFY_EMAIL; if (!to) return { skipped: true };
  return r.emails.send({ from: FROM(), to, subject: 'Yeni müraciət: ' + title, html: '<p><strong>' + fullName + '</strong> (' + email + '): ' + title + '</p>' });
}
