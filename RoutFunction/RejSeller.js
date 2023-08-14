const dbConnection = require('../config/Db')
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');



const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL/TLS
    auth: {
      user: process.env.smtpMail,
      pass: process.env.smtpPass,
    },
  });


async function RejSeller (req, res, next){
    const {sellerSln} = req.params;
    try{
        const [inVerify] = await dbConnection.query('SELECT * FROM seller_verify WHERE slno = ?',[sellerSln]);
        if(inVerify.length>0){
            
           
                
                const mail = inVerify[0].email;
                const mailOptions = {
                    from: 'EShopBD.com', // Sender address (must be your Gmail address)
                    to: `${mail}`,           // Recipient address
                    subject: 'Seller verification Status .',            // Subject of the email
                    text: `You have been rejected as a seller of our organization. Contact Our service for more information.`, // Email body in plain text
                    // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
                };
                transporter.sendMail(mailOptions, async (error, info) => {
                    if (error) {
                        return res.status(200).json({
                            message : 'Some Error Occured.'
                        })
                    } else {
                        const [img] = await dbConnection.query('SELECT image FROM seller_verify WHERE slno = ?',[sellerSln]);
                        
                        const url = img[0].image;
                        const parts = url.split('/'); 
                        const filename = parts[parts.length - 1];
                        const imagePath = path.join('public/images', filename);
                        fs.unlinkSync(imagePath);

                        await dbConnection.query('DELETE FROM seller_verify WHERE slno = ?',[sellerSln]);
                        return res.status(200).json({
                            message : 'Successfully Rejected!!!'
                        })
                    }
                });
            
        }else{
            return res.status(200).json({
                message : 'Failed.'
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = RejSeller;