require('dotenv').config();
const dbConnection = require('../config/Db');

const bcrypt = require('bcrypt');

const Joi = require('joi');
const nodemailer = require('nodemailer');

  
function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPassword = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomPassword += charset[randomIndex];
    }
  
    return randomPassword;
  }

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL/TLS
    auth: {
      user: process.env.smtpMail,
      pass: process.env.smtpPass,
    },
  });


async   function ForgotPass(req, res, next){
    try{
        const {mail, role} = req.body;
        if(role == 'User'){ 

            const   [ismailex] = await dbConnection.query('SELECT * FROM user WHERE email = ?',[mail]);
            if(ismailex.length>0){
                const genPass = generateRandomPassword(10);
                const saltRounds = 10;
                const pass = await bcrypt.hash(genPass, saltRounds); 

                const [newset] = await dbConnection.query('UPDATE forgot_pass SET otp = ? WHERE email = ?',[pass, mail]);
                if(newset){
                    const mailOptions = {
                        from: 'EShopBD.com', // Sender address (must be your Gmail address)
                        to: `${mail}`,           // Recipient address
                        subject: 'Account New Password .',            // Subject of the email
                        text: `Your New Password Is ${genPass}. You Can Log In With It Now.`, // Email body in plain text
                        // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
                    };

                    transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            return res.status(200).json({
                                message : 'Some Error Occured.'
                            })
                        } else {
                            
                            return res.status(200).json({
                                message : 'Success'
                            })
                        }
                    });

                }else{
                    return  res.status(200).json({
                        message : 'Failed.'
                    })
                }
            }else{
                return  res.status(200).json({
                    message : 'Failed.'
                })
            }

        }else if(role == 'Seller'){

            const   [ismailex] = await dbConnection.query('SELECT * FROM seller WHERE email = ?',[mail]);
            if(ismailex.length>0){
                const genPass = generateRandomPassword(10);
                const saltRounds = 10;
                const pass = await bcrypt.hash(genPass, saltRounds); 

                const [newset] = await dbConnection.query('UPDATE forgot_pass_seller SET otp = ? WHERE email = ?',[pass, mail]);
                if(newset){
                    const mailOptions = {
                        from: 'EShopBD.com', // Sender address (must be your Gmail address)
                        to: `${mail}`,           // Recipient address
                        subject: 'Account New Password .',            // Subject of the email
                        text: `Your New Password Is ${genPass}. You Can Log In With It Now.`, // Email body in plain text
                        // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
                    };

                    transporter.sendMail(mailOptions, async (error, info) => {
                        if (error) {
                            return res.status(200).json({
                                message : 'Some Error Occured.'
                            })
                        } else {
                            return res.status(200).json({
                                message : 'Success'
                            })
                        }
                    });


                }else{
                    return  res.status(200).json({
                        message : 'Failed.'
                    })
                }

            }else{
                return  res.status(200).json({
                    message : 'Failed.'
                })
            }

        }else{
            return  res.status(200).json({
                message : 'Failed.'
            })
        }
    }catch(err){
        next(err);
    }
}

module.exports = ForgotPass;