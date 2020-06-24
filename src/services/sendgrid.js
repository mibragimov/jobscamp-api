const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(email, name) {
  try {
    await sgMail.send({
      to: email,
      from: "mibragimov@hotmail.com",
      subject: "Thank you for joining Jobscamp!",
      text: `Welcome to the app, ${name}! Let me know how you get along with the app.`,
    });
  } catch (err) {
    console.log(err);
  }
}

async function sendCancellationEmail(email, name) {
  try {
    await sgMail.send({
      to: email,
      from: "mibragimov@hotmail.com",
      subject: "Sorry to see you go!",
      text: `Goodbye ${name}! I hope to see you back sometime soon.`,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
