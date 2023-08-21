require('dotenv').config()
const dbConnection = require('../config/Db')

async function GetAllClientOrders(req, res, next){
    try{
        const  {usersl} = req.params;
        const [ifOrders] = await dbConnection.query('SELECT * FROM delivery_order WHERE seller_slno = ? ORDER BY slno DESC',[usersl]);
        if(ifOrders.length>0){

            await Promise.all(
                ifOrders.map(async(each)=>{
                    var  [buyer] = await dbConnection.query('SELECT * FROM user WHERE slno = ?',[each.user_slno]);
                    if(buyer.length > 0){
                        each.buyerEmail = buyer[0].email;
                        
                    }else{
                        each.buyerEmail = 'Banned or Removed.';
                       
                    } 
                })
            );

            await Promise.all(
                ifOrders.map(async(each)=>{
                    if(each.event_or_not == 'not event'){
                        var [productData] = await dbConnection.query('SELECT image1, name FROM product WHERE slno = ?',[each.product_slno]);
                        if(productData.length>0){
                            each.name = productData[0].name;
                            each.image = productData[0].image1;
                        }else{
                            each.name = 'Something Went Wrong.';
                            each.image = 'Error In Image.';
                        }
                    }else{
                        var [productData] = await dbConnection.query('SELECT image1, name FROM event_products WHERE slno = ?',[each.product_slno]);
                        if(productData.length>0){
                            each.name = productData[0].name;
                            each.image = productData[0].image1;
                        }else{
                            each.name = 'Something Went Wrong.';
                            each.image = 'Error In Image.';
                        }
                    }
                })
            );


            return res.status(200).json({
                message : 'Success',
                order : ifOrders
            })


        }else{
            return res.status(200).json({
                message : 'Success',
                order : []
            })
        }

    }catch(err){
        next(err)
    }
}

module.exports = GetAllClientOrders;