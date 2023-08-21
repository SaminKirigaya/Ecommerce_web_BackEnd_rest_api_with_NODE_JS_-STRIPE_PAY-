const dbConnection = require('../config/Db')

async function ChangeDelCond(req, res, next){
    try{
        const {value, prodNo, event, user} = req.body;
        console.log(value, prodNo, event, user)
        const [prdData] = await dbConnection.query('SELECT * FROM delivery_order WHERE product_slno = ? AND event_or_not = ? AND user_slno = ?',[prodNo, event, user]);
        if(prdData.length>0){
            const [success] = await dbConnection.query('UPDATE delivery_order SET delivery_status = ? WHERE product_slno = ? AND event_or_not = ? AND user_slno = ?',[value, prodNo, event, user]);
            if(success){
                const [newData] = await dbConnection.query('SELECT * FROM delivery_order WHERE product_slno = ? AND event_or_not = ? AND user_slno = ?',[prodNo, event, user]);
                await  dbConnection.query('INSERT INTO deliverystatus (event_or_not, user_slno, product_slno, changedValue, deliveryserial) VALUES (?,?,?,?,?)',[event, user, prodNo, value, newData[0].slno])
                return res.status(200).json({
                    message : 'Success'
                })
            }else{
                return res.status(200).json({
                    message : 'Failed'
                })
            }
        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }

    }catch(err){
        next(err)
    }
}

module.exports = ChangeDelCond;