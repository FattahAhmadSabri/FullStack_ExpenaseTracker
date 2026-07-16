const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: "Expense Tracker",
        email: process.env.BREVO_SENDER,
      },

      to: [
        {
          email: to,
        },
      ],

      subject,

      htmlContent,
    });

    console.log("Email Sent");
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = sendEmail;
