const dbConnection = require('../config/Db');

async function GetMyProducts(req, res, next){
    const {usersl} = req.params;
    try{
        const [getSellerProduct] = await dbConnection.query('SELECT * FROM event_products WHERE seller_slno = ? ORDER BY slno DESC',[usersl]);
        if(getSellerProduct.length>0){
            return  res.status(200).json({
                message : 'Successful',
                productData : getSellerProduct
            })
        }else{
            return  res.status(200).json({
                message : 'Failed'
            
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = GetMyProducts;