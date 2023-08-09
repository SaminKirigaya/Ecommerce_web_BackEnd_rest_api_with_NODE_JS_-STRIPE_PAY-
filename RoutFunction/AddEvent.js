require('dotenv').config();
const dbConnection = require('../config/Db');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');


const registrationSchema = Joi.object({
    name :  Joi.string().pattern(/^([a-zA-Z%0-9\-_:!?,.'" ]+)$/).required(),
    desc : Joi.string().pattern(/^([a-zA-Z%0-9\-_:'!?,." ]+)$/).required(),
    enddate : Joi.date().required()

  });
  

async function AddEvent(req, res, next){
    try{    
        const {error} = registrationSchema.validate(req.body);
        if(error){
            if(req.file){
                fs.unlinkSync(req.file.path);
                
            }
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

            const name = req.body.name;
            const desc = req.body.desc;
            const enddate = req.body.enddate;
            const globalimage = `${process.env.Imgpath}/public/images/${imageFile.filename}`;

            const [addEvent] = await dbConnection.query('INSERT INTO events (event, event_end, event_image, event_details) VALUES (?,?,?,?)',[name, enddate, globalimage, desc])
            if(addEvent){
                return res.status(200).json({
                    message : 'Successfully Added!!!'
                })
            }

    }catch(error){
        next(error)
    }
}

module.exports = AddEvent;