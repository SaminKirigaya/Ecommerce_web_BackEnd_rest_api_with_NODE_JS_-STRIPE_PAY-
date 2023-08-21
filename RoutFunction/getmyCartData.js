const dbConnection = require('../config/Db')

async function getmyCartData(req, res, next){
    try{
        const {usersl} = req.params;
        const [isthereincart] = await dbConnection.query('SELECT * FROM cart WHERE user_slno = ?',[usersl]);
        if(isthereincart.length>0){
            const updatedCart = [];

            for (const each of isthereincart) {
                
                if(each.event_or_not == 'not event'){


                    const [productData] = await dbConnection.query(`SELECT amount_left,price,image1,name FROM product WHERE slno = ?`, [each.product_slno]);
                
                    if (productData.length > 0 && productData[0].amount_left == 0) {
                        // Remove from cart and isthereincart
                        await dbConnection.query('DELETE FROM cart WHERE user_slno = ? AND product_slno = ?', [usersl, each.product_slno]);
                    } else {
                        
                        await dbConnection.query('UPDATE cart SET in_stock=? WHERE user_slno = ? AND product_slno = ?',[productData[0].amount_left, usersl, each.product_slno]);
                        each.price = productData[0].price;
                        each.image = productData[0].image1;
                        each.name = productData[0].name;
                    
                        updatedCart.push(each);
                    }


                }else{


                    const [productData] = await dbConnection.query(`SELECT amount_left,price,image1,name FROM event_products WHERE slno = ?`, [each.product_slno]);
                
                    if (productData.length > 0 && productData[0].amount_left == 0) {
                        // Remove from cart and isthereincart
                        await dbConnection.query('DELETE FROM cart WHERE user_slno = ? AND product_slno = ?', [usersl, each.product_slno]);
                    } else {
                        
                        await dbConnection.query('UPDATE cart SET in_stock=? WHERE user_slno = ? AND product_slno = ?',[productData[0].amount_left, usersl, each.product_slno]);
                        each.price = productData[0].price;
                        each.image = productData[0].image1;
                        each.name = productData[0].name;
                        updatedCart.push(each);
                        
                    }


                }
                
            }

            return res.status(200).json({
                message: 'Success',
                cartPrd: updatedCart
            });
        }else{
            return  res.status(200).json({
                message : 'Failed'
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports = getmyCartData;