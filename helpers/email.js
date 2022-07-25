const sgMail = require('@sendgrid/mail');


const registrationEmail = (data) =>{
  const { email, name, token } = data
  
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'silcerquatti@gmail.com', // Use the email address or domain you verified above
    subject: "MERN project - Check your account",
    text: "Check your account in this MERN project",
    html:`
    <p> 
      ¡Hi ${name}!
    </p>
    <p> 
      Your account is almost ready, to check it please click 
      <a href="${process.env.FRONTEND_URL}/confirm/${token}">
        HERE
      </a> 
      and you will be able to create your own projects!
    </p>
    <p>
      If you did not create this account, ignore this message
    </p>
  `,
  };


  //ES6
  sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);
    
    if (error.response) {
      console.error(error.response.body)
    }
  });
  }


  const emailForgotPassword = async (data) =>{
    const { email, name, token } = data
  
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'silcerquatti@gmail.com', // Use the email address or domain you verified above
      subject: "MERN project - Check your account",
      text: "Check your account in this MERN project",
      html: `
        <p> 
          ¡Hi ${name}!
        </p>
        <p> 
          Have you requested to reset your password? 
          <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">
            CLICK HERE
          </a> 
          and you will be able to create a new password to login to your account
        </p>
        <p>
          If you did not create this account, ignore this message.
        </p>
      `,
    }

  sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);
    
    if (error.response) {
      console.error(error.response.body)
    }
  });
  
  }
  
module.exports = {registrationEmail, emailForgotPassword}
