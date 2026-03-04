import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendPasswordResetEmail(email, token) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/reimposta-password?token=${token}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#FFF8F0;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:500px;margin:40px auto;padding:0 20px;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#1B2A4A,#D4A017);border-radius:12px 12px 0 0;padding:30px 24px;text-align:center;">
                <h1 style="margin:0;color:white;font-size:28px;letter-spacing:1px;text-shadow:2px 2px 0 rgba(0,0,0,0.15);">
                    🏆 FantaChicco
                </h1>
            </div>
            <!-- Body -->
            <div style="background:white;border:3px solid #E8D5C4;border-top:none;border-radius:0 0 12px 12px;padding:32px 24px;box-shadow:4px 4px 0 #E8D5C4;">
                <h2 style="margin:0 0 16px;color:#1A1A2E;font-size:20px;">
                    🔑 Reimposta la tua password
                </h2>
                <p style="color:#5A5A6E;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Hai richiesto di reimpostare la password del tuo account FantaChicco.
                    Clicca il pulsante qui sotto per scegliere una nuova password:
                </p>
                <div style="text-align:center;margin:28px 0;">
                    <a href="${resetLink}"
                       style="display:inline-block;background:#D4A017;color:white;text-decoration:none;padding:14px 36px;border-radius:8px;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:0.5px;border:3px solid #B8860B;box-shadow:0 4px 0 #B8860B;">
                        🚀 Reimposta Password
                    </a>
                </div>
                <p style="color:#9E9EB0;font-size:13px;line-height:1.5;margin:24px 0 0;padding-top:20px;border-top:2px dashed #E8D5C4;">
                    ⏰ Questo link scade tra <strong>1 ora</strong>.<br>
                    Se non hai richiesto tu il reset della password, ignora questa email.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    // If SMTP is not configured, log to console for development
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('='.repeat(60));
        console.log('📧 PASSWORD RESET EMAIL (SMTP non configurato)');
        console.log(`   To: ${email}`);
        console.log(`   Link: ${resetLink}`);
        console.log('='.repeat(60));
        return;
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"FantaChicco" <noreply@fantachicco.it>',
        to: email,
        subject: '🔑 Reimposta la tua password – FantaChicco',
        html: htmlContent,
    });
}
