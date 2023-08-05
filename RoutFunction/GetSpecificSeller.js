const dbConnection = require('../config/Db');

async function GetSpecificSeller(req, res, next){
    const {sellerSln} = req.params;
    try{
        const [ifExist] = await dbConnection.query('SELECT name, email, country, age, gender, mobile, nid_image, address, date_of_birth, image FROM  seller_verify WHERE slno = ?',[sellerSln]);
        if(ifExist){
            return res.status(200).json({
                message : 'Success',
                sellerData : ifExist
            });
        }else{
            return res.status(200).json({
                message : 'Failed',
               
            });
        }
    }catch(error){
        next(error)
    }
}

module.exports = GetSpecificSeller;