require('dotenv').config();
const dbConnection = require('../config/Db');
async function AllEvents(req, res, next){
    try{
        const [eventData] = await dbConnection.query('SELECT * FROM events');
        if(eventData.length>0){
            return  res.status(200).json({
                message : 'Successful',
                eventData : eventData
            })
        }else{
            return  res.status(200).json({
                message : 'Failed'
               
            })
        }
    }catch(error){
        next(error)
    }
}   

module.exports = AllEvents;