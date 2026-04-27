const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

/**
 * Send email notification
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('📧 Email error:', error.message);
    return false;
  }
};

/**
 * Send appointment notification to admin
 */
const sendAppointmentNotification = async (appointment) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0a1628; padding: 20px; text-align: center;">
        <h1 style="color: #c9a84c; margin: 0;">New Appointment Request</h1>
      </div>
      <div style="padding: 20px; background: #f8f6f0;">
        <p><strong>Name:</strong> ${appointment.name}</p>
        <p><strong>Email:</strong> ${appointment.email}</p>
        <p><strong>Phone:</strong> ${appointment.phone}</p>
        <p><strong>Case Type:</strong> ${appointment.caseType}</p>
        <p><strong>Preferred Date:</strong> ${new Date(appointment.preferredDate).toLocaleDateString('en-IN')}</p>
        <p><strong>Time:</strong> ${appointment.preferredTime}</p>
        <p><strong>Message:</strong> ${appointment.message || 'N/A'}</p>
      </div>
      <div style="background: #0a1628; padding: 15px; text-align: center;">
        <p style="color: #888; font-size: 12px; margin: 0;">Sharma & Associates Law Firm</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: process.env.SMTP_USER,
    subject: `New Appointment: ${appointment.name} - ${appointment.caseType}`,
    html
  });
};

/**
 * Send contact inquiry notification
 */
const sendContactNotification = async (contact) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0a1628; padding: 20px; text-align: center;">
        <h1 style="color: #c9a84c; margin: 0;">New Contact Inquiry</h1>
      </div>
      <div style="padding: 20px; background: #f8f6f0;">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || 'N/A'}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Message:</strong> ${contact.message}</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: process.env.SMTP_USER,
    subject: `Contact Inquiry: ${contact.subject}`,
    html
  });
};

module.exports = { sendEmail, sendAppointmentNotification, sendContactNotification };
