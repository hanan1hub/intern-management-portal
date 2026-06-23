const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendInternCredentials = async ({ name, email, password }) => {
  const portalUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const fromAddress = process.env.RESEND_FROM || 'Intern Portal <onboarding@resend.dev>';

  await resend.emails.send({
    from: fromAddress,
    to: [email],
    subject: 'Welcome to the Intern Management Portal — Your Login Credentials',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #0d6efd); padding: 32px 40px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 1.6rem; font-weight: 700;">Intern Management Portal</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 0.95rem;">Your account is ready</p>
        </div>
        <div style="padding: 32px 40px; background: #fff;">
          <p style="color: #334155; font-size: 1rem; margin-top: 0;">Hi <strong>${name}</strong>,</p>
          <p style="color: #334155;">Your intern account has been created. Use the credentials below to sign in:</p>

          <div style="background: #f1f5f9; border-radius: 10px; padding: 20px 24px; margin: 24px 0; border-left: 4px solid #0d6efd;">
            <p style="margin: 0 0 8px; color: #64748b; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">Your Credentials</p>
            <p style="margin: 4px 0; color: #0f172a;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 4px 0; color: #0f172a;"><strong>Password:</strong> <code style="background:#e2e8f0;padding:2px 8px;border-radius:4px;">${password}</code></p>
          </div>

          <a href="${portalUrl}/login"
            style="display:inline-block;background:#0d6efd;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.95rem;">
            Sign In Now →
          </a>

          <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 28px; margin-bottom: 0;">
            If you did not expect this email, please ignore it or contact your administrator.
          </p>
        </div>
      </div>
    `,
  });
};
