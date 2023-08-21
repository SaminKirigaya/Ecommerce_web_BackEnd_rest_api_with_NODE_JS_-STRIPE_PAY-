const dbConnection = require('../config/Db');
const upload = require('../config/Multer');
const path = require('path');
const jimp = require('jimp');
const bcrypt = require('bcrypt');
const fs = require('fs');
const Joi = require('joi');



const registrationSchema = Joi.object({
    name :  Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    country: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    age: Joi.number().integer().min(7).max(90).required(),
    gender: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    dateofBirth : Joi.date().required(),
    address : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    phoneNumber : Joi.string().pattern(/^([0-9 ]+)$/).required()

  });


async function EditSeller (req, res, next){
    const {usersl} = req.params;
    try{
        const { error, value } = registrationSchema.validate(req.body);

        if(error){
            const errorMessages = error.details.map((err) => err.message);
            return res.status(200).json({ message : error.details[0].message});
        }

        const dateofBirthz = req.body.dateofBirth;
        const agez = req.body.age;
        const genderz = req.body.gender;
        const namez = req.body.name;
        const countryz = req.body.country;
        const addressz = req.body.address;
        
        const phoneNumberz = req.body.phoneNumber;

        const [seller] = await dbConnection.query('SELECT * FROM seller WHERE slno = ?',[usersl]);
        if(seller.length>0){
            const mail = seller[0].email;
            const pass2 = seller[0].pass;
            const globalimage = seller[0].image;
            const globalnidImage = seller[0].nid_image;
        
        const [success] = await dbConnection.query('INSERT INTO seller_verify (name, email, date_of_birth, country, gender, mobile, image, address, nid_image, pass, age) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [namez, mail, dateofBirthz, countryz, genderz, phoneNumberz, globalimage, addressz, globalnidImage, pass2, agez]);
        if(success){
      
            await dbConnection.query('DELETE FROM seller WHERE slno = ?',[usersl]);
            await dbConnection.query('DELETE FROM tokendb WHERE email = ?',[mail]);
            return  res.status(200).json({
                message : 'Successful!!! You will be mailed once you are varified by our authority !'
            })
                
        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }

        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }





        }catch(error){
            next(error);
        }
}

module.exports = EditSeller;