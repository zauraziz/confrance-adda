import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL;

export async function sendArticleConfirmation({ to, fullName, title, lang = 'az' }) {
  const subject = lang === 'az'
    ? 'Müraciətiniz qəbul edildi — ADDA Konfrans'
    : 'Your submission has been received — ADDA Conference';

  const html = lang === 'az' ? `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;padding:40px 20px;color:#0a1a3d">
      <div style="border-top:3px solid #c9a55a;padding-top:30px">
        <h1 style="font-family:Georgia,serif;color:#002366;font-weight:300;font-size:28px;margin:0 0 20px">Hörmətli ${fullName},</h1>
        <p style="line-height:1.7;font-size:15px">"<strong>${title}</strong>" başlıqlı məqaləniz uğurla qəbul edildi.</p>
        <p style="line-height:1.7;font-size:15px">Elmi şura müraciətinizi 14 iş günü ərzində nəzərdən keçirəcək. Nəticə bu e-poçt ünvanına göndəriləcək.</p>
        <hr style="border:none;border-top:1px solid #002366;opacity:.15;margin:30px 0">
        <p style="color:#0a1a3d;opacity:.6;font-size:13px">ADDA Beynəlxalq Konfrans Katibliyi<br>conference@adda.edu.az</p>
      </div>
    </div>
  ` : `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;padding:40px 20px;color:#0a1a3d">
      <div style="border-top:3px solid #c9a55a;padding-top:30px">
        <h1 style="font-family:Georgia,serif;color:#002366;font-weight:300;font-size:28px;margin:0 0 20px">Dear ${fullName},</h1>
        <p style="line-height:1.7;font-size:15px">Your article "<strong>${title}</strong>" has been successfully submitted.</p>
        <p style="line-height:1.7;font-size:15px">The scientific committee will review it within 14 business days. The decision will be sent to this email address.</p>
        <hr style="border:none;border-top:1px solid #002366;opacity:.15;margin:30px 0">
        <p style="color:#0a1a3d;opacity:.6;font-size:13px">ADDA International Conference Secretariat<br>conference@adda.edu.az</p>
      </div>
    </div>
  `;

  return resend.emails.send({ from: FROM, to, subject, html });
}

export async function sendArticleStatusUpdate({ to, fullName, title, status, notes, lang = 'az' }) {
  const isAccepted = status === 'accepted';
  const subject = lang === 'az'
    ? (isAccepted ? 'Məqaləniz qəbul edildi' : 'Məqalə müraciəti haqqında')
    : (isAccepted ? 'Your article has been accepted' : 'About your article submission');

  const body = lang === 'az' ? `
    <p style="line-height:1.7">Hörmətli ${fullName},</p>
    <p style="line-height:1.7">"<strong>${title}</strong>" başlıqlı məqaləniz haqqında qərar:
    <strong style="color:${isAccepted ? '#c9a55a' : '#dc2626'}">${isAccepted ? 'Qəbul edildi' : 'Rədd edildi'}</strong></p>
    ${notes ? `<p style="line-height:1.7;background:#f7f6f1;padding:15px;border-left:3px solid #c9a55a">${notes}</p>` : ''}
  ` : `
    <p style="line-height:1.7">Dear ${fullName},</p>
    <p style="line-height:1.7">Decision regarding your article "<strong>${title}</strong>":
    <strong style="color:${isAccepted ? '#c9a55a' : '#dc2626'}">${isAccepted ? 'Accepted' : 'Not accepted'}</strong></p>
    ${notes ? `<p style="line-height:1.7;background:#f7f6f1;padding:15px;border-left:3px solid #c9a55a">${notes}</p>` : ''}
  `;

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:560px;margin:auto;padding:40px 20px;color:#0a1a3d">
      <div style="border-top:3px solid #c9a55a;padding-top:30px">
        ${body}
        <hr style="border:none;border-top:1px solid #002366;opacity:.15;margin:30px 0">
        <p style="color:#0a1a3d;opacity:.6;font-size:13px">ADDA Beynəlxalq Konfrans Katibliyi</p>
      </div>
    </div>
  `;

  return resend.emails.send({ from: FROM, to, subject, html });
}

export async function sendAdminNotification({ fullName, email, title }) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Yeni məqalə müraciəti: ${title}`,
    html: `<p>Yeni məqalə müraciəti daxil oldu:</p>
           <ul>
             <li><strong>Müəllif:</strong> ${fullName}</li>
             <li><strong>E-poçt:</strong> ${email}</li>
             <li><strong>Başlıq:</strong> ${title}</li>
           </ul>
           <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/articles">Admin paneldə bax</a></p>`,
  });
}
