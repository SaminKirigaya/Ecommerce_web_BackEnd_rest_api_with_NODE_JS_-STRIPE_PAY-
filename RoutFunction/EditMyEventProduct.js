const dbConnection = require('../config/Db');
const Joi = require('joi');

const registrationSchema = Joi.object({
    intro :  Joi.string().pattern(/^([a-zA-Z0-9%.\-_:,!?.'" ]+)$/).required(),
    desc :  Joi.string().pattern(/^([a-zA-Z0-9%.\-_:,!?.'" ]+)$/).required(),
    prdType : Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    prdBrand : Joi.string().pattern(/^([a-zA-Z ]+)$/).required(),
    amountLeft: Joi.number().integer().required(),
    price : Joi.number().integer().required()

  });


async function EditMyEventProduct(req, res, next){
    const {usersl, productSln} = req.params;
    try{
        const { error, value } = registrationSchema.validate(req.body);
        if(error){
            return res.status(200).json({ message : error.details[0].message});
        }

        const [prdExist] = await dbConnection.query('SELECT * FROM event_products WHERE slno = ?',[productSln]);
        if(prdExist.length>0){
            if(prdExist[0].seller_slno == usersl){
                const intro = req.body.intro;
                const desc = req.body.desc;
                const prdType = req.body.prdType;
                const prdBrand = req.body.prdBrand;
                const amountLeft = req.body.amountLeft;
                const price = req.body.price;

                const [isUpdated] = await dbConnection.query('UPDATE event_products SET name=?, type=?, brand=?, amount_left=?, price=?, description=? WHERE slno = ?',[intro, prdType, prdBrand, amountLeft, price, desc, productSln]);
                if(isUpdated){
                    return res.status(200).json({
                        message : 'Successfully Edited Product ...'
                    });
                }
            }
        }


    }catch(error){
        next(error)
    }

}

module.exports = EditMyEventProduct;