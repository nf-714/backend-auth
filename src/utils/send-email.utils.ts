import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "8176e3001@smtp-brevo.com", // generated ethereal user
      pass: "S90qGdFJPE5kyzXA", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nasif" nfuad714@gmail.com', // sender address
    to: `${to}`, // list of receivers
    subject: `${subject}`, // Subject line
    text: `${text}`, // plain text body
  });
};
