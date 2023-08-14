const dbConnection = require('../config/Db');

async function SeeProdBrand(req, res, next){
    try{
        const [getTypes] = await dbConnection.query('SELECT * FROM brand_type');
        if(getTypes){
            return res.status(200).json({
                message : 'Success',
                productType : getTypes
            })
        }else{
            return res.status(200).json({
                message : 'Failed'
               
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = SeeProdBrand;