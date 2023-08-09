const dbConnection = require('../config/Db');

async function GetMyProducts(req, res, next){
    const {usersl} = req.params;
    try{
        const [getSellerProduct] = await dbConnection.query('SELECT * FROM product WHERE seller_slno = ? ORDER BY slno DESC',[usersl]);
        if(getSellerProduct.length>0){
            return  res.status(200).json({
                message : 'Successful',
                productData : getSellerProduct
            })
        }
    }catch(error){
        next(error)
    }
}

module.exports = GetMyProducts;