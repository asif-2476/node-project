const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 2525,
    auth: {
      user: "apikey",
      pass: "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"
    }
  });

  module.exports = transport;