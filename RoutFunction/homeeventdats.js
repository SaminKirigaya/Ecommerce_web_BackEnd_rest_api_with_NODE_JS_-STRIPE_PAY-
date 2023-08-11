require('dotenv').config();
const dbConnection = require('../config/Db');
async function homeeventdats(req, res, next){
    try{
        const [eventData] = await dbConnection.query('SELECT * FROM events');
        if(eventData.length>0){
            return  res.status(200).json({
                message : 'Successful',
                eventData : eventData
            })
        }
    }catch(error){
        next(error)
    }
}   

module.exports = homeeventdats;