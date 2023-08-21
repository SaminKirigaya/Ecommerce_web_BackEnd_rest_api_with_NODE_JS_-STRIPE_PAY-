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
    country: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    age: Joi.number().integer().min(7).max(90).required(),
    gender: Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    dateofBirth : Joi.date().required(),
    address : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    delivery : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    phoneNumber : Joi.string().pattern(/^([0-9 ]+)$/).required()

  });
  
async function EditMe(req, res, next){
    try{
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader.split(' ')[1];
        const {usersl} = req.params;
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
        const deliveryz = req.body.delivery;
        const phoneNumberz = req.body.phoneNumber;



        const [success] = await dbConnection.query('UPDATE user SET name=?,date_of_birth=?, country=?, gender=?, mobile=?, address=?, delivery_address=?, age=? WHERE slno = ?', [namez, dateofBirthz, countryz, genderz, phoneNumberz, addressz, deliveryz, agez, usersl]);
        if(success){
            await dbConnection.query('DELETE FROM tokendb WHERE token = ?',[token]);
            return  res.status(200).json({
                message : 'Successful!!! Please Login Again To Your Id.'
            })
           
        }else{
            return res.status(200).json({
                message : 'Some Error Occured.'
            })
        }
    }catch(error){
        next(error)
    }
    
}

module.exports = EditMe;