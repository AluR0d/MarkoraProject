import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  await transporter.sendMail({
    from: `"Markora" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Restablece tu contraseña',
    html: `
      <p>Haz clic en el siguiente enlace para cambiar tu contraseña:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  });
}

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Markora" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: body,
    });

    console.log(`📨 Email enviado a ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Error enviando a ${to}:`, error);
    throw error;
  }
}
