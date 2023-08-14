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
    country: Joi.string().pattern(/^([a-zA-Z]+)$/).required(),
    sallery: Joi.number().required(),
    nid : Joi.number().required(),
    gender: Joi.string().pattern(/^([a-zA-Z]+)$/).required(),
    dateofBirth : Joi.date().required(),
    address : Joi.string().required(),
    joined : Joi.date().required(),
    phoneNumber : Joi.string().required(),
    designation : Joi.string().required(),

  });
  


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL/TLS
    auth: {
      user: process.env.smtpMail,
      pass: process.env.smtpPass,
    },
  });


async function AddEmp(req, res){

    const { error, value } = registrationSchema.validate(req.body);

    if(error){
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        const errorMessages = error.details.map((err) => err.message);
        return res.status(200).json({ message : error.details[0].message});
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
    
    const [emailExists] = await dbConnection.query('SELECT * FROM employee WHERE email = ?', [mail]);

    

    if (emailExists.length>0) {
        fs.unlinkSync(imageFile.path);
        return  res.status(200).json({ message: 'Sorry Email Already Exist ... You Can Not Use Same Email Twice.' });
    }  


        const passz = req.body.password;
        const saltRounds = 10;
        const pass2 = await bcrypt.hash(passz, saltRounds);  

        const dateofBirthz = req.body.dateofBirth;
        
        const genderz = req.body.gender;
        const namez = req.body.name;
        const countryz = req.body.country;
        const addressz = req.body.address;
        
        const phoneNumberz = req.body.phoneNumber;
        const salleryz = req.body.sallery;
        const nidz = req.body.nid;
        const joinedz = req.body.joined;
        const designationz = req.body.designation;

        const imageUrl = path.join('public/images', imageFile.filename);
        // Resize the uploaded image using jimp
        const image = await jimp.read(imageFile.path);
        await image.resize(100, 100).quality(50).writeAsync(imageUrl);
        
        const globalimage = `${process.env.Imgpath}/public/images/${imageFile.filename}`;

        const [success] = await dbConnection.query('INSERT INTO employee (name, email, date_of_birth, country, gender, mobile, image, address, pass, nid, sallery, designation, joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [namez, mail, dateofBirthz, countryz, genderz, phoneNumberz, globalimage, addressz, pass2, nidz, salleryz, designationz, joinedz]);
        if(success){

            const passown = passz;
            const mailOptions = {
                from: 'EShopBD.com', // Sender address (must be your Gmail address)
                to: `${mail}`,           // Recipient address
                subject: 'Account verification code .',            // Subject of the email
                text: `Your office login Pass-code : ${passown} And Email : ${mail}. You have been successfully added as an honorable employee of our organization.`, // Email body in plain text
                // html: '<p>Your HTML message goes here (if you want to send an HTML email)</p>'
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    return res.status(200).json({
                        message : 'Some Error Occured.'
                    })
                } else {
                    
                    return res.status(200).json({
                        message : 'Successfully Added!!!'
                    })
                }
            });
        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }
}

module.exports = AddEmp;