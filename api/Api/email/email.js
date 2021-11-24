const sgMail = require( '@sendgrid/mail');
const User = require( '../models/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendSignUpOtp = async (user) => {
  let a = Math.random();
  a = String(a);
  a = a.substring(2, 6);
  user.otp = a;
  await user.save();
  console.log('OTP '+ a);

  sgMail.send({
    to: user.email,
    from: 'sourav2fly@gmail.com',
    subject: 'OTP for Tick-deblock',
    text: `Welcome ${user.name} to Tick-deblock, your OTP is ${a}, please verify this to start`,
  });
};

const sendSignInOTP = async (user) => {
  let a = Math.random();
  a = String(a);
  a = a.substring(2, 6);
  user.otp = a;
  console.log('OTP '+ a);
  await user.save();

  sgMail.send({
    to: user.email,
    from: 'sourav2fly@gmail.com',
    subject: 'OTP for Tick-deblock',
    text: `Welcome ${user.name} \n To the Tick-deblock. \n New LogIn request received. Your OTP is ${a}, please verify this to Login in into your wallet.`,
  });
};

module.exports = {
  sendSignUpOtp,
  sendSignInOTP
};