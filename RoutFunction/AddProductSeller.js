require('dotenv').config();
const dbConnection = require('../config/Db');
const upload = require('../config/Multer');

const jimp = require('jimp');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
const Joi = require('joi');




const registrationSchema = Joi.object({
    intro :  Joi.string().pattern(/^([a-zA-Z0-9%.\-_:.!?,'" ]+)$/).required(),
    desc :  Joi.string().pattern(/^([a-zA-Z0-9%.\-_:,!?.'" ]+)$/).required(),
    prdType : Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    prdBrand : Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    amountLeft: Joi.number().integer().required(),
    price : Joi.number().integer().required()

  });


async function AddProductSeller(req, res, next){

    const {usersl} = req.params; 
    const { error, value } = registrationSchema.validate(req.body);
    try{
    if(error){
        if (req.files) {
            // Delete the uploaded files to avoid cluttering the server
            if (req.files['img1'] && req.files['img1'][0]) {
                fs.unlinkSync(req.files['img1'][0].path);
            }

            if (req.files['img2'] && req.files['img2'][0]) {
                fs.unlinkSync(req.files['img2'][0].path);
            }

            if (req.files['img3'] && req.files['img3'][0]) {
                fs.unlinkSync(req.files['img3'][0].path);
            }
        }
        
        return res.status(200).json({ message : error.details[0].message});
    }

    if (!req.files) {
        if (req.files) {
            // Delete the uploaded files to avoid cluttering the server
            if (req.files['img1'] && req.files['img1'][0]) {
                fs.unlinkSync(req.files['img1'][0].path);
            }

            if (req.files['img2'] && req.files['img2'][0]) {
                fs.unlinkSync(req.files['img2'][0].path);
            }

            if (req.files['img3'] && req.files['img3'][0]) {
                fs.unlinkSync(req.files['img3'][0].path);
            }
        }
        return res.status(200).json({ message : 'Image file is required!' });
      }

    const img3 = req.files['img3'][0];  
    const img2 = req.files['img2'][0];  
    const img1 = req.files['img1'][0];
    // Validate image file type and size
    const allowedFiletypes = /jpeg|jpg/;
    const img1mimetype = allowedFiletypes.test(img1.mimetype);
    const img1extname = allowedFiletypes.test(path.extname(img1.originalname).toLowerCase());

    const img2mimetype = allowedFiletypes.test(img2.mimetype);
    const img2extname = allowedFiletypes.test(path.extname(img2.originalname).toLowerCase());

    const img3mimetype = allowedFiletypes.test(img3.mimetype);
    const img3extname = allowedFiletypes.test(path.extname(img3.originalname).toLowerCase());

    if (!img1mimetype || !img1extname || !img2mimetype || !img2extname || !img3mimetype || !img3extname) {

        if (req.files['img1'] && req.files['img1'][0]) {
            fs.unlinkSync(req.files['img1'][0].path);
        }

        if (req.files['img2'] && req.files['img2'][0]) {
            fs.unlinkSync(req.files['img2'][0].path);
        }

        if (req.files['img3'] && req.files['img3'][0]) {
            fs.unlinkSync(req.files['img3'][0].path);
        }

        return res.status(200).json({ message : 'Images only (JPEG/JPG) allowed!' });
    }

        const intro = req.body.intro;
        const desc = req.body.desc;

        if(desc.length>600){
            return  res.status(200).json({
                message : 'More Than 600 Characters In The Description.'
            })
        }
        const prdType = req.body.prdType;
        const prdBrand = req.body.prdBrand;
        const amountLeft = req.body.amountLeft;
        const price = req.body.price;
        

        const imageUrl = path.join('public/images', img1.filename);
        const image = await jimp.read(img1.path);
        await image.resize(400, 400).quality(90).writeAsync(imageUrl);

        const imageUrl2 = path.join('public/images', img2.filename);
        const image2 = await jimp.read(img2.path);
        await image2.resize(400, 400).quality(90).writeAsync(imageUrl2);

        const imageUrl3 = path.join('public/images', img3.filename);
        const image3 = await jimp.read(img3.path);
        await image3.resize(400, 400).quality(90).writeAsync(imageUrl3);
        
        const globalImage3 = `${process.env.Imgpath}/public/images/${img3.filename}`;
        const globalImage2 = `${process.env.Imgpath}/public/images/${img2.filename}`;
        const globalImage1 = `${process.env.Imgpath}/public/images/${img1.filename}`;

        const [success] = await dbConnection.query('INSERT INTO product (name, type, brand, seller_slno, amount_left, price, image1, image2, image3, description, rating, total_view, like_amount, dislike_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [intro, prdType, prdBrand, usersl, amountLeft, price, globalImage1, globalImage2, globalImage3, desc , 0, 0, 0, 0]);
        if(success){
      
            return  res.status(200).json({
                message : 'Successfully Added Product ...'
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

module.exports = AddProductSeller;