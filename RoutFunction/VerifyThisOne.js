require('dotenv').config()
const dbConnection = require('../config/Db')
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL/TLS
    auth: {
      user: process.env.smtpMail,
      pass: process.env.smtpPass,
    },
  });


async function VerifyThisOne (req, res, next){
    const {sellerSln} = req.params;
    try{
        const [inVerify] = await dbConnection.query('SELECT * FROM seller_verify WHERE slno = ?',[sellerSln]);
        if(inVerify.length>0){
            const [confirmed] = await dbConnection.query('INSERT INTO seller (name, email, country, age, gender, mobile, nid_image, address, date_of_birth, image, pass) VALUES (?,?,?,?,?,?,?,?,?,?,?)',[inVerify[0].name, inVerify[0].email, inVerify[0].country, inVerify[0].age, inVerify[0].gender, inVerify[0].mobile, inVerify[0].nid_image, inVerify[0].address, inVerify[0].date_of_birth, inVerify[0].image, inVerify[0].pass]);
            if(confirmed){
                
                const mail = inVerify[0].email;
                const mailOptions = {
                    from: 'EShopBD.com', // Sender address (must be your Gmail address)
                    to: `${mail}`,           // Recipient address
                    subject: 'Seller verification Status .',            // Subject of the email
                    text: `You have been successfully added as an honorable seller of our organization. You can login with your email and password as a seller.`, // Email body in plain text
                    // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
                };
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        return res.status(200).json({
                            message : 'Some Error Occured.'
                        })
                    } else {
                        await dbConnection.query('INSERT INTO forgot_pass_seller (otp, email) VALUES (?, ?)',[inVerify[0].pass, inVerify[0].email]);
                        await dbConnection.query('DELETE FROM seller_verify WHERE slno = ?',[sellerSln]);
                        return res.status(200).json({
                            message : 'Successfully Added!!!'
                        })
                    }
                });
            }
        }
    }catch(error){
        next(error)
    }
}

module.exports = VerifyThisOne;