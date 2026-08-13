/**
 * Transactional email. Kept as a thin, isolated module — same idea as
 * src/lib/payments/ — so swapping providers touches one file. No provider is
 * wired here since that needs real credentials (Resend API key, SMTP, or an
 * Iranian provider); until then this logs to the server console in dev.
 */

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailInput): Promise<void> {
  if (process.env.EMAIL_SERVER) {
    // TODO: wire a real provider, e.g.:
    // await resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, html });
  }
  console.log(`[email:dev] to=${to} subject="${subject}"\n${html}`);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "بازیابی رمز عبور کلاه‌لند",
    html: `
      <div dir="rtl" style="font-family:sans-serif">
        <p>برای بازیابی رمز عبور خود روی لینک زیر کلیک کنید. این لینک تا ۱ ساعت معتبر است.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>اگر این درخواست را شما ثبت نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  await sendEmail({
    to,
    subject: "به کلاه‌لند خوش آمدید",
    html: `<div dir="rtl" style="font-family:sans-serif"><p>${name} عزیز، ثبت‌نام شما با موفقیت انجام شد.</p></div>`,
  });
}
