const dbConnection = require('../config/Db');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');

const registrationSchema = Joi.object({
    productType :  Joi.string().pattern(/^([a-zA-Z0-9 ]+)$/).required(),
   
    });
  
async function AddBrand(req, res, next){
    const {error} = registrationSchema.validate(req.body);
    if(error){
        return  res.status(200).json({
            message : error.details[0].message
        })
    }
    try{
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

          
          const globalimage = `${process.env.Imgpath}/public/images/${imageFile.filename}`;

        const productType = req.body.productType;
        const [successAdd] = await dbConnection.query('INSERT INTO brand_type (type, image) VALUES (?, ?)',[productType, globalimage]);
        if(successAdd){
            return  res.status(200).json({
                message : 'Successfully Added Product Brand ...'
            })
        }else{
            return  res.status(200).json({
                message : 'Error Occured ...'
            })
        }
    }catch(error){
        next(error);
    }
}

module.exports = AddBrand;