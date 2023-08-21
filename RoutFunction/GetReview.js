const dbConnection = require('../config/Db');

async function GetReview(req, res, next){
    try{
        const {usersl} = req.params;
        const {serial} = req.body;

        const [data] = await dbConnection.query('SELECT reviewdone FROM delivery_order WHERE slno = ? AND user_slno = ?',[serial, usersl]);
        if(data.length>0){
            return  res.status(200).json({
                message : 'Success',
                done : data[0].reviewdone
            })
        }else{
            return res.status(200).json({
                message : 'Failed.'
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports = GetReview;