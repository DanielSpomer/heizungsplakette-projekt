const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'jaxnaid@gmail.com',
      pass: 'hqwy bhrh jzdi nmiz'
    }
  });

  try {
    const info = await transporter.sendMail({
      from: 'jaxnaid@gmail.com',
      to: 'spomerdaniel6@googlemail.com',
      subject: 'Test Email',
      text: 'This is a test email from the Heizungsplakette application.'
    });

    console.log('Test email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

testEmail();