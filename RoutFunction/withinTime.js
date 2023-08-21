require('dotenv').config();
const dbConnection = require('../config/Db');

async function withinTime(req, res, next){
    try{
        const {usersl} = req.params;
        const   {serial} = req.body;
        const [timedata] = await dbConnection.query('SELECT time FROM  deliverystatus  WHERE deliveryserial = ? AND user_slno = ? AND changedValue = ?',[serial, usersl, 'Delivered']);
        if(timedata.length>0){
            const retrievedDatetime =   timedata[0].time;
            const originalDate = new Date(retrievedDatetime);


            const modifiedDate = new Date(originalDate);
            modifiedDate.setDate(modifiedDate.getDate() + 7);

            const today = new Date();

            if (today >= originalDate && today <= modifiedDate) {
                return  res.status(200).json({
                    message : 'Success',
                    done : true
                })
              } else {
                return  res.status(200).json({
                    message : 'Success',
                    done : false
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

module.exports = withinTime;