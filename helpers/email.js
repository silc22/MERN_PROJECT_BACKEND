const nodemailer = require("nodemailer");

const registrationEmail = async (data) =>{
  const { email, name, token } = data
  
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //email info
  const info = await transport.sendMail({
    from: '"MERN project" <silcerquatti@gmail.com>', 
    to: email,
    subjecto: "MERN project - Check your account",
    text: "Check your account in this MERN project",
    html: `
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
  })

  }

  const emailForgotPassword = async (data) =>{
    const { email, name, token } = data
    
    //TODO: HACER VARIABLE DE ENTORNO
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    //email info
    const info = await transport.sendMail({
      from: '"MERN project" <silcerquatti@gmail.com>', 
      to: email,
      subjecto: "MERN project - Reset your password",
      text: "Reset your password",
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
    })
  
    }
  
module.exports = {registrationEmail, emailForgotPassword}
