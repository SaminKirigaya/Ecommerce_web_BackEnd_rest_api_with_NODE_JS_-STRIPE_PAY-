require('dotenv').config();
const dbConnection = require('../config/Db');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');




const registrationSchema = Joi.object({
    name :  Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    mail: Joi.string().email().required(),
    country: Joi.string().pattern(/^([a-zA-Z]+)$/).required(),
    sallery: Joi.number().required(),
    nid : Joi.number().required(),
    gender: Joi.string().pattern(/^([a-zA-Z]+)$/).required(),
    dateofBirth : Joi.date().required(),
    address : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),
    phoneNumber : Joi.string().pattern(/^([0-9 ]+)$/).required(),
    designation : Joi.string().pattern(/^([a-zA-Z,.\-_!?/:0-9'" ]+)$/).required(),

  });
  


  async function EditEmpData (req, res){
    const {empSl} = req.params;

    const { error, value } = registrationSchema.validate(req.body);

    if(error){
 
        return res.status(200).json({ message : error.details[0].message});
      }
    
      const [emailExists] = await dbConnection.query('SELECT * FROM employee WHERE slno = ?', [empSl]);
      if (emailExists.length>0) {
        
        const mail = req.body.mail;

        const [mailInDb] = await dbConnection.query('SELECT * FROM employee WHERE email = ?',[mail]);
        if(mailInDb.length>0){
            if(mailInDb[0].slno != empSl){
                return  res.status(200).json({
                    message : 'New Mail You Added Already Exist To Someone In Database.'
                });
            }
           
        }

        const dateofBirthz = req.body.dateofBirth;
        
        const genderz = req.body.gender;
        const namez = req.body.name;
        const countryz = req.body.country;
        const addressz = req.body.address;
        
        const phoneNumberz = req.body.phoneNumber;
        const salleryz = req.body.sallery;
        const nidz = req.body.nid;
        
        const designationz = req.body.designation;


        const [updateDB] = await dbConnection.query('UPDATE employee SET name = ?,email = ?, date_of_birth = ?, gender = ?, country = ?, address = ?, nid = ?, designation = ?, mobile = ?, sallery = ? WHERE slno = ?', [namez, mail, dateofBirthz, genderz, countryz, addressz, nidz, designationz, phoneNumberz, salleryz, empSl]);
        if(updateDB){
            return  res.status(200).json({
                message : 'Successfully Edited!!!'
            });
        }else{
            return  res.status(200).json({
                message : 'Some Error Occured...'
            });
        }


      }else{
            return  res.status(200).json({
                message : 'Employee Do Not Exist ...'
            })
      }

  }

  module.exports = EditEmpData;