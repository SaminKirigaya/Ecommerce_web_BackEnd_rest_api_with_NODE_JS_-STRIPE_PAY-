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
    phoneNumber : Joi.string().pattern(/^([0-9 ]+)$/).required()

  });


async function RegSeller(req, res){

    const { error, value } = registrationSchema.validate(req.body);

    if(error){
        if (req.files) {
            // Delete the uploaded files to avoid cluttering the server
            if (req.files['image'] && req.files['image'][0]) {
                fs.unlinkSync(req.files['image'][0].path);
            }

            if (req.files['nidImage'] && req.files['nidImage'][0]) {
                fs.unlinkSync(req.files['nidImage'][0].path);
            }
        }
        const errorMessages = error.details.map((err) => err.message);
        return res.status(200).json({ message : errorMessages});
    }

    if (!req.files) {
        if (req.files) {
            // Delete the uploaded files to avoid cluttering the server
            if (req.files['image'] && req.files['image'][0]) {
                fs.unlinkSync(req.files['image'][0].path);
            }

            if (req.files['nidImage'] && req.files['nidImage'][0]) {
                fs.unlinkSync(req.files['nidImage'][0].path);
            }
        }
        return res.status(200).json({ message : 'Image file is required!' });
      }

    const nidImage = req.files['nidImage'][0];  
    const imageFile = req.files['image'][0];
    // Validate image file type and size
    const allowedFiletypes = /jpeg|jpg/;
    const mimetype = allowedFiletypes.test(imageFile.mimetype);
    const extname = allowedFiletypes.test(path.extname(imageFile.originalname).toLowerCase());

    const nidmimetype = allowedFiletypes.test(nidImage.mimetype);
    const nidextname = allowedFiletypes.test(path.extname(nidImage.originalname).toLowerCase());

    if (!mimetype || !extname || !nidmimetype || !nidextname) {

        if (req.files['image'] && req.files['image'][0]) {
            fs.unlinkSync(req.files['image'][0].path);
        }

        if (req.files['nidImage'] && req.files['nidImage'][0]) {
            fs.unlinkSync(req.files['nidImage'][0].path);
        }

        return res.status(200).json({ message : 'Images only (JPEG/JPG) allowed!' });
    }



    const mail = req.body.mail;
    
    const [emailExists] = await dbConnection.query('SELECT * FROM seller WHERE email = ?', [mail]);

    const [emailInVerify] = await dbConnection.query('SELECT * FROM seller_verify WHERE email = ?', [mail]);

    if (emailExists.length>0 || emailInVerify.length>0) {

        if (req.files['image'] && req.files['image'][0]) {
            fs.unlinkSync(req.files['image'][0].path);
        }

        if (req.files['nidImage'] && req.files['nidImage'][0]) {
            fs.unlinkSync(req.files['nidImage'][0].path);
        }

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
        
        const phoneNumberz = req.body.phoneNumber;
        const imageUrl = path.join('public/images', imageFile.filename);

        // Resize the uploaded image using jimp
        const image = await jimp.read(imageFile.path);
        await image.resize(100, 100).quality(50).writeAsync(imageUrl);
        
        const globalnidImage = `${process.env.Imgpath}/public/images/${nidImage.filename}`;
        const globalimage = `${process.env.Imgpath}/public/images/${imageFile.filename}`;

        const [success] = await dbConnection.query('INSERT INTO seller_verify (name, email, date_of_birth, country, gender, mobile, image, address, nid_image, pass, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [namez, mail, dateofBirthz, countryz, genderz, phoneNumberz, globalimage, addressz, globalnidImage, pass2, agez]);
        if(success){
      
            return  res.status(200).json({
                message : 'Successful!!! You will be mailed once you are varified by our authority !'
            })
                
        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }
}

module.exports = RegSeller;