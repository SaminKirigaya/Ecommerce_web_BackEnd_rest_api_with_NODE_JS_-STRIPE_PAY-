const dbConnection = require('../config/Db');

async function RemoveFromCart(req, res, next){
    try{
        const {usersl, slno} = req.params;
        const [ownerprd] = await dbConnection.query('SELECT * FROM cart WHERE user_slno = ? AND slno = ?',[usersl, slno]);
        if(ownerprd.length>0){
            const [success] = await dbConnection.query('DELETE FROM cart WHERE user_slno = ? AND slno = ?',[usersl, slno]);
            if(success){
                return  res.status(200).json({
                    message : 'Success'
                })
            }else{
                return  res.status(200).json({
                    message : 'Failed.'
                })
            }
        }else{
            return  res.status(200).json({
                message : 'Not Your Product.'
            })
        }
        
    }catch(err){
        next(err)
    }
}

module.exports = RemoveFromCart;