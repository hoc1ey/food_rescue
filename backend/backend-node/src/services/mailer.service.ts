import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Validar variables de entorno
const requiredEnvVars = [
  'GOOGLE_EMAIL',
  'GOOGLE_APP_PASSWORD',
  'MAIL_FROM'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

/**
 * Crear transporter de nodemailer con Google App Password
 * Usa autenticación básica en lugar de OAuth2 para mayor durabilidad
 */
async function createTransporter() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD
    }
  });

  return transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Enviar un correo electrónico
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);

    logger.info('Email sent successfully', {
      to,
      subject,
      messageId: result.messageId
    });
  } catch (error) {
    logger.error('Failed to send email', {
      to,
      subject,
      error
    });
    throw error;
  }
}

interface DonationEmailData {
  donorName: string;
  beneficiaryName: string;
  productName: string;
  quantity: number;
  unit: string;
  location: {
    name: string;
    mainStreet: string;
    secondaryStreet: string;
    city: {
      name: string;
    };
  };
}

/**
 * Enviar correo cuando se reclama una donación
 */
export async function sendDonationClaimedEmail(
  donorEmail: string,
  data: DonationEmailData
): Promise<void> {
  const subject = '✅ Tu donación ha sido reclamada - Food Rescue';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .label {
          font-weight: 600;
          color: #6b7280;
        }
        .value {
          color: #111827;
        }
        .highlight {
          background: #fef3c7;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #6b7280;
          font-size: 14px;
        }
        .button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          border-radius: 6px;
          text-decoration: none;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 ¡Buenas noticias!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Tu donación ha sido reclamada</p>
      </div>
      
      <div class="content">
        <p>Hola <strong>${data.donorName}</strong>,</p>
        
        <p>Nos complace informarte que <strong>${data.beneficiaryName}</strong> ha reclamado tu donación.</p>
        
        <div class="card">
          <h2 style="margin-top: 0; color: #667eea;">📦 Detalles de la donación</h2>
          
          <div class="info-row">
            <span class="label">Producto:</span>
            <span class="value">${data.productName}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Cantidad:</span>
            <span class="value">${data.quantity} ${data.unit}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Beneficiario:</span>
            <span class="value">${data.beneficiaryName}</span>
          </div>
        </div>
        
        <div class="card">
          <h2 style="margin-top: 0; color: #667eea;">📍 Ubicación de recolección</h2>
          
          <div class="info-row">
            <span class="label">Lugar:</span>
            <span class="value">${data.location.name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Dirección:</span>
            <span class="value">${data.location.mainStreet} y ${data.location.secondaryStreet}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Ciudad:</span>
            <span class="value">${data.location.city.name}</span>
          </div>
        </div>
        
        <div class="highlight">
          <strong>⏰ Próximos pasos:</strong>
          <p style="margin: 10px 0 0 0;">
            El beneficiario coordinará contigo la fecha y hora de recolección. 
            Por favor, mantén la donación disponible en la ubicación indicada.
          </p>
        </div>
        
        <p style="text-align: center; margin-top: 30px;">
          <strong>¡Gracias por contribuir a reducir el desperdicio de alimentos! 🌍</strong>
        </p>
        
        <div class="footer">
          <p>Este es un correo automático de <strong>Food Rescue</strong></p>
          <p>Ayudamos a conectar donantes con quienes más lo necesitan</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: donorEmail,
    subject,
    html
  });
}
