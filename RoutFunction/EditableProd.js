const dbConnection = require('../config/Db');
async function EditableProd(req, res, next){
    try{
        const {usersl, productSln} = req.params;
        const [existProd] = await dbConnection.query('SELECT name,type,brand,amount_left,price,description,seller_slno FROM product WHERE slno = ?',[productSln]);
        if(existProd.length>0){
            if(existProd[0].seller_slno == usersl){
                return res.status(200).json({
                    productData : existProd 
                })
            }
        }
    }catch(error){
        next(error)
    }
} 

module.exports = EditableProd;