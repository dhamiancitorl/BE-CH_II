import transporter from "../config/mailing.js";
import { env } from "../config/env.js";

export const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

export async function sendWelcomeEmail(mail, name) {
  await transporter.sendMail({
    from: env.EMAIL_USER,
    to: mail,
    subject: "Bienvenido a la plataforma",
    html: `
    <h1>Bienvenido ${name} a la plataforma</h1>
    <p>Gracias por registrarte en nuestra plataforma. Esperamos que disfrutes de nuestros servicios.</p>
    <p>Atentamente, El equipo de la plataforma</p>
    `,
  });
}

export async function sendPasswordResetEmail(userEmail, resetToken) {
  const resetUrl = `http://localhost:${env.PORT}/api/sessions/reset-password?token=${resetToken}`;
  const textBody = `
    Recuperación de contraseña
    Tu token (válido 1 hora):
    ${resetToken}
    En Postman (o similar):
    POST ${resetUrl}
    Headers: Content-Type: application/json
    Body (raw JSON):
    {
      "token": "${resetToken}",
      "newPassword": "TuNuevaPass123"
    }
    Si no pediste esto, ignorá este correo.
    ESTO ES POR QUE NO TENEMOS UNA PÁGINA PARA RESTABLECER LA CONTRASEÑA - LO USAMOS DESDE POSTMAN
    `.trim();

  const htmlBody = `
    <h1>Recuperación de contraseña</h1>
    <p>Tu token (válido <strong>1 hora</strong>):</p>
    <pre style="background:#f4f4f4;padding:12px;word-break:break-all;">${resetToken}</pre>
    <p><strong>Postman</strong> — método <code>POST</code>, URL:</p>
    <pre style="background:#f4f4f4;padding:12px;">${resetUrl}</pre>
    <p>Body → raw → JSON:</p>
    <pre style="background:#f4f4f4;padding:12px;">{
    "token": "${resetToken}",
    "newPassword": "ACA va tu PASSWORD NUEVA"
  }</pre>
    <p>Si no pediste esto, ignorá este correo.</p>
    <p>ESTO ES POR QUE NO TENEMOS UNA PÁGINA PARA RESTABLECER LA CONTRASEÑA - LO USAMOS DESDE POSTMAN</p>
    `;

  await transporter.sendMail({
    from: env.EMAIL_USER,
    to: userEmail,
    subject: "Recuperación de Contraseña - Mi App",
    text: textBody,
    html: htmlBody,
  });
}
