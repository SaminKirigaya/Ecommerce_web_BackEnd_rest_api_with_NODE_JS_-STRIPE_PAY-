const dbConnection = require('../config/Db');

async function SeeProdType(req, res, next){
    try{
        const [getTypes] = await dbConnection.query('SELECT * FROM product_type');
        if(getTypes){
            return res.status(200).json({
                message : 'Success',
                productType : getTypes
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = SeeProdType;