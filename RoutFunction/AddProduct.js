const dbConnection = require('../config/Db');
const Joi = require('joi');

const registrationSchema = Joi.object({
    productType :  Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
   
  });
  
async function AddProduct(req, res, next){
    const {error} = registrationSchema.validate(req.body);
    if(error){
        return  res.status(200).json({
            message : error.details[0].message
        })
    }
    try{
        const productType = req.body.productType;
        const [successAdd] = await dbConnection.query('INSERT INTO product_type (type) VALUES (?)',[productType]);
        if(successAdd){
            return  res.status(200).json({
                message : 'Successfully Added Product Type ...'
            })
        }
    }catch(error){
        next(error);
    }
}

module.exports = AddProduct;