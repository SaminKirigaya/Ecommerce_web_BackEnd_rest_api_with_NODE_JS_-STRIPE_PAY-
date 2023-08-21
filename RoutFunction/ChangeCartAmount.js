const dbConnection = require('../config/Db')

async function ChangeCartAmount(req, res, next){
    try{
        const {usersl, slno, amountNew} = req.params;
        const [ownpost] = await dbConnection.query('SELECT * FROM cart WHERE slno = ? AND user_slno = ?',[slno, usersl]);
        if(ownpost.length>0){
            const [success] = await dbConnection.query('UPDATE cart SET myamount = ? WHERE slno = ? AND user_slno = ?',[amountNew, slno, usersl])

            if(success){
                return  res.status(200).json({
                    message : 'Success'
                })
            }else{
                return  res.status(200).json({
                    message : 'Failed...'
                })
            }

        }else{
            return  res.status(200).json({
                message : 'Failed...'
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports=ChangeCartAmount;