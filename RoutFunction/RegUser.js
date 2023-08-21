require('dotenv').config();
const dbConnection = require('../config/Db');
const upload = require('../config/Multer');
const path = require('path');
const jimp = require('jimp');
const bcrypt = require('bcrypt');
const fs = require('fs');
const Joi = require('joi');
const nodemailer = require('nodemailer');



const registrationSchema = Joi.object({
    name :  Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    mail: Joi.string().email().required(),
    password: Joi.string().pattern(/^([a-zA-Z0-9*!@]+){6,50}$/).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required(),
    country: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    age: Joi.number().integer().min(7).max(90).required(),
    gender: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    dateofBirth : Joi.date().required(),
    address : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    delivery : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    phoneNumber : Joi.string().pattern(/^([0-9 ]+)$/).required()

  });
  
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


async function RegUser(req, res){

    const { error, value } = registrationSchema.validate(req.body);

    if(error){
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        const errorMessages = error.details.map((err) => err.message);
        return res.status(200).json({ message : errorMessages});
      }

    if (!req.file) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(200).json({ message : 'Image file is required!' });
      }
    const imageFile = req.file;
    // Validate image file type and size
    const allowedFiletypes = /jpeg|jpg/;
    const mimetype = allowedFiletypes.test(imageFile.mimetype);
    const extname = allowedFiletypes.test(path.extname(imageFile.originalname).toLowerCase());
    if (!mimetype || !extname) {
        fs.unlinkSync(imageFile.path);
        return res.status(200).json({ message : 'Images only (JPEG/JPG) allowed!' });
    }

    const mail = req.body.mail;
    
    const [emailExists] = await dbConnection.query('SELECT * FROM user WHERE email = ?', [mail]);

    const [emailInVerify] = await dbConnection.query('SELECT * FROM user_verify WHERE email = ?', [mail]);

    if (emailExists.length>0 || emailInVerify.length>0) {
        fs.unlinkSync(imageFile.path);
        return res.status(200).json({ message: 'Sorry Email Already Exist ... You Can Not Use Same Email Twice.' });
    }  


        const passz = req.body.password;
        const saltRounds = 10;
        const pass2 = await bcrypt.hash(passz, saltRounds);  

        const dateofBirthz = req.body.dateofBirth;
        const agez = req.body.age;
        const genderz = req.body.gender;
        const namez = req.body.name;
        const countryz = req.body.country;
        const addressz = req.body.address;
        const deliveryz = req.body.delivery;
        const phoneNumberz = req.body.phoneNumber;

        const imageUrl = path.join('public/images', imageFile.filename);
        // Resize the uploaded image using jimp
        const image = await jimp.read(imageFile.path);
        await image.resize(100, 100).quality(50).writeAsync(imageUrl);
        
        const globalimage = `${process.env.Imgpath}/public/images/${imageFile.filename}`;

        const [success] = await dbConnection.query('INSERT INTO user_verify (name, email, date_of_birth, country, gender, mobile, image, address, delivery_address, pass, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [namez, mail, dateofBirthz, countryz, genderz, phoneNumberz, globalimage, addressz, deliveryz, pass2, agez]);
        if(success){

            const verifyCode = generateRandomPassword(15);
            const mailOptions = {
                from: 'EShopBD.com', // Sender address (must be your Gmail address)
                to: `${mail}`,           // Recipient address
                subject: 'Account verification code .',            // Subject of the email
                text: `Your verification code is: ${verifyCode}. At verify email page verifying your account email you can log in.`, // Email body in plain text
                // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    return res.status(200).json({
                        message : 'Some Error Occured.'
                    })
                } else {
                    const [existCode] = await dbConnection.query('SELECT * FROM user_verify_code WHERE email = ?',[mail]);
                    if(existCode.length>0){
                        await   dbConnection.query('DELETE FROM user_verify_code WHERE email = ?',[mail]);
                    }

                    await dbConnection.query('INSERT INTO user_verify_code (email, otp) VALUES (?, ?)',[mail, verifyCode]);

                    return res.status(200).json({
                        message : 'Successful!!! Check Your Mail For Verification Code. After Verifying With That You Can Login !'
                    })
                }
            });
        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }
}

module.exports = RegUser;