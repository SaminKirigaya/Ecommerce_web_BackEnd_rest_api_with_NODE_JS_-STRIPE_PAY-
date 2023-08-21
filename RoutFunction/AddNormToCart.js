const dbConnection = require('../config/Db');

async function AddNormToCart(req, res, next){
    try{
        const {prdsl} = req.params;

        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader.split(' ')[1];
        const [tokenz] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
        if(tokenz.length > 0){
            const [userSl] = await dbConnection.query('SELECT * FROM user WHERE email = ?',[tokenz[0].email]);
            if(userSl.length >0){

                const [product] = await dbConnection.query('SELECT amount_left, seller_slno FROM product WHERE slno = ?',[prdsl]);
                if(product.length > 0){

                    if(product[0].amount_left == 0){
                        return  res.status(200).json({
                            message : 'Nothing Left.'
                        })
                    }

                    const [exist] = await dbConnection.query('SELECT * FROM cart WHERE product_slno=? AND user_slno=?',[prdsl, userSl[0].slno]);
                    if(exist.length>0){
                        return  res.status(200).json({
                            message : 'Success'
                        })
                    }

                    const [success] = await dbConnection.query('INSERT INTO cart (product_slno, user_slno, seller_slno, in_stock, event_or_not, myamount) VALUES (?,?,?,?,?,?)',[prdsl, userSl[0].slno, product[0].seller_slno, product[0].amount_left, 'not event', 1]);
                    if(success){
                        return  res.status(200).json({
                            message : 'Success'
                        })
                    }else{
                        return  res.status(200).json({
                            message : 'Success'
                        })
                    }

                }else{
                    return  res.status(200).json({
                        message : 'Failed .'
                    })
                }

            }else{
                return  res.status(200).json({
                    message : 'Failed .'
                })
            }

        }else{
            
        }
    }catch(err){
        next(err)
    }
}

module.exports = AddNormToCart;