const dbConnection = require('../config/Db');

async function ReportAdding(req, res, next){
    try{
        const   {usersl} = req.params;
        const   {delivNo} = req.body;

        const   [delivery] = await dbConnection.query('SELECT * FROM delivery_order WHERE slno = ? AND user_slno = ?',[delivNo, usersl]);
        if(delivery.length>0){
            await dbConnection.query('INSERT INTO report (user_slno, product_slno, seller_slno, event_or_not, deliveryserial) VALUES (?,?,?,?,?)',[usersl, delivery[0].product_slno, delivery[0].seller_slno, delivery[0].event_or_not, delivNo]);

            await dbConnection.query('UPDATE delivery_order SET reportdone = ? WHERE slno = ? AND user_slno = ?',['Done', delivNo, usersl])
            return res.status(200).json({
                message : 'Success'
            })
        }else{
            return  res.status(200).json({
                message : 'Failed.'
            })
        }
    }catch(err){
        next(err)
    }
}

module.exports = ReportAdding;