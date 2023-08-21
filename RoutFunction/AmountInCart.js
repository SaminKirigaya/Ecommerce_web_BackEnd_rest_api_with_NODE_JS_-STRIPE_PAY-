const dbConnection = require('../config/Db')

async function AmountInCart(req, res, next){
    try{
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader.split(' ')[1];
        const [tokenz] = await dbConnection.query('SELECT * FROM tokendb WHERE token = ?',[token]);
        if(tokenz.length > 0){

            const [userSl] = await dbConnection.query('SELECT * FROM user WHERE email = ?',[tokenz[0].email]);
            if(userSl.length >0){
                const [inCart] = await dbConnection.query('SELECT * FROM cart WHERE user_slno = ?',[userSl[0].slno]);
                if(inCart.length>0){
                    return  res.status(200).json({
                        message : 'Success',
                        cartamount : inCart.length
                    })
                }else{
                    return  res.status(200).json({
                        message : 'Success',
                        cartamount : 0
                    })
                }
            }else{
                return  res.status(200).json({
                    message : 'Failed.'
                })
            }

        }else{
            return  res.status(200).json({
                message : 'Failed.'
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports = AmountInCart;