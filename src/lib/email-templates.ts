function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function baseLayout(opts: {
  preheader: string;
  title: string;
  intro: string;
  bodyHtml: string;
  footerNote: string;
}): string {
  // Text-focused, professional, inline CSS only, 600px max, works in Gmail
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f7f8;">
    <span style="display:none;visibility:hidden;opacity:0;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(opts.preheader)}</span>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f6f7f8;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px 0 24px;">
                <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#6b7280;">New message</div>
                <h1 style="margin:8px 0 0 0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:18px;line-height:1.4;color:#111827;font-weight:600;">${escapeHtml(opts.title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px 0 24px;">
                <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#374151;">${escapeHtml(opts.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;">
                <div style="border:1px solid #e5e7eb;border-radius:6px;padding:16px;background-color:#f9fafb;">
                  ${opts.bodyHtml}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 20px 24px;">
                <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b7280;">${escapeHtml(opts.footerNote)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 24px;border-top:1px solid #f3f4f6;background-color:#fbfbfb;">
                <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#9ca3af;">This email was sent via the contact form. Gmail may rewrite the From address to the authenticated account.</p>
              </td>
            </tr>
          </table>
          <div style="max-width:600px;margin:12px auto 0 auto;text-align:center;">
            <p style="margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:11px;color:#9ca3af;">Please do not reply directly to automated receipts unless instructed.</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type TemplateResult = {
  subject: string;
  html: string;
  text: string;
};

export function adminTemplate(data: {
  fullName: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  receivedAt?: Date;
}): TemplateResult {
  const safeFullName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeMobile = escapeHtml(data.mobile);
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message);
  const when = (data.receivedAt ?? new Date()).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `New inquiry from ${data.email}`;

  const bodyHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Full Name</div>
          <div style="margin-top:4px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111827;">${safeFullName}</div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">From</div>
          <div style="margin-top:4px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111827;"><a href="mailto:${safeEmail}" style="color:#111827;text-decoration:underline;">${safeEmail}</a></div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Mobile</div>
          <div style="margin-top:4px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111827;"><a href="tel:${safeMobile}" style="color:#111827;text-decoration:none;">${safeMobile}</a></div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Subject</div>
          <div style="margin-top:4px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111827;">${safeSubject}</div>
        </td>
      </tr>
      <tr>
        <td style="padding-bottom:10px;">
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Received</div>
          <div style="margin-top:4px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;color:#374151;">${escapeHtml(when)}</div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Message</div>
          <div style="margin-top:6px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#111827;white-space:pre-wrap;">${safeMessage}</div>
        </td>
      </tr>
    </table>
  `;

  const html = baseLayout({
    preheader: `New message from ${data.fullName} (${data.email}) - ${when}`,
    title: "New contact form submission",
    intro:
      "You received a new message via the website contact form. Reply directly to respond to the sender.",
    bodyHtml,
    footerNote: `Tip: Use Reply to respond to ${data.email}. This is an automated notification.`,
  });

  const text =
    `New contact form submission\n` +
    `Full Name: ${data.fullName}\n` +
    `From: ${data.email}\n` +
    `Mobile: ${data.mobile}\n` +
    `Subject: ${data.subject}\n` +
    `Received: ${when}\n\n` +
    `Message:\n${data.message}\n`;

  return { subject, html, text };
}

export function receiptTemplate(data: {
  fullName: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
}): TemplateResult {
  const safeFullName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeMobile = escapeHtml(data.mobile);
  const safeSubject = escapeHtml(data.subject);
  const safeMessage = escapeHtml(data.message);
  const subject = "We received your message";

  const bodyHtml = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#111827;">
      <p style="margin:0 0 10px 0;">Hi ${safeFullName}, thanks for reaching out - we received your message and will get back to you as soon as possible.</p>
      <p style="margin:0 0 12px 0;color:#374151;">Here is a copy for your records:</p>
      <div style="border:1px solid #e5e7eb;border-radius:6px;padding:12px;background-color:#f9fafb;margin-bottom:12px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td style="padding-bottom:6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Full Name</td></tr>
          <tr><td style="padding-bottom:10px;font-size:14px;color:#111827;">${safeFullName}</td></tr>
          <tr><td style="padding-bottom:6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Email</td></tr>
          <tr><td style="padding-bottom:10px;font-size:14px;color:#111827;">${safeEmail}</td></tr>
          <tr><td style="padding-bottom:6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Mobile</td></tr>
          <tr><td style="padding-bottom:10px;font-size:14px;color:#111827;">${safeMobile}</td></tr>
          <tr><td style="padding-bottom:6px;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;">Subject</td></tr>
          <tr><td style="padding-bottom:10px;font-size:14px;color:#111827;">${safeSubject}</td></tr>
        </table>
      </div>
      <div style="border-left:3px solid #e5e7eb;padding:10px 12px;background-color:#ffffff;border-radius:4px;">
        <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#6b7280;margin-bottom:4px;">Your message</div>
        <div style="font-size:14px;line-height:1.7;color:#111827;white-space:pre-wrap;">${safeMessage}</div>
      </div>
      <p style="margin:14px 0 0 0;font-size:13px;color:#374151;">We typically reply within 1-2 business days. If your matter is urgent, please reply to this email.</p>
    </div>
  `;

  const html = baseLayout({
    preheader: "Thanks for contacting us - we received your message",
    title: "Message received",
    intro:
      "We appreciate you taking the time to write to us. This is a confirmation that your message was delivered.",
    bodyHtml,
    footerNote:
      "You are receiving this because you submitted the contact form. If this was not you, you can ignore this email.",
  });

  const text =
    `Thanks for reaching out - we received your message.\n\n` +
    `Hi ${data.fullName},\n\n` +
    `Full Name: ${data.fullName}\n` +
    `Email: ${data.email}\n` +
    `Mobile: ${data.mobile}\n` +
    `Subject: ${data.subject}\n\n` +
    `Your message:\n${data.message}\n\n` +
    `We typically reply within 1-2 business days.\n`;

  return { subject, html, text };
}
