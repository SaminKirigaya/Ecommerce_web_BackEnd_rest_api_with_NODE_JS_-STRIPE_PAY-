const dbConnection = require('../config/Db');

async function getSpecificStates(req, res, next){
    try{    
        const {usersl} = req.params;
        const {serial} = req.body;
        const [data] = await dbConnection.query('SELECT * FROM deliverystatus WHERE deliveryserial = ? AND user_slno = ? ORDER BY solno DESC',[serial, usersl]);
        if(data.length>0){
            return res.status(200).json({
                message : 'Success',
                statesall : data
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

module.exports = getSpecificStates;