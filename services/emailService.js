const nodemailer = require('nodemailer');

const sendEmail = async newArticles => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const articleList = newArticles
      .map(
        article =>
          `<li><a href="${`https://www.binance.com/ru-UA/support/announcement/${article.code}`}">${
            article.title
          }</a></li>`
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: 'New Binance articles available',
      html: `<p>The following new articles were found:</p><ul>${articleList}</ul>`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = {sendEmail};
