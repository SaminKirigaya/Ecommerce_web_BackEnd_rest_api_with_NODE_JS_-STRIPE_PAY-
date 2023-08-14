const dbConnection = require('../config/Db');
const path = require('path');
const fs = require('fs');

async function DelEvent(req, res, next){
    const {prodSl} = req.params;
    const [eventExist] = await dbConnection.query('SELECT * FROM events WHERE slno = ?',[prodSl]);

    if(eventExist.length>0){
        const [isDeleted] = await dbConnection.query('DELETE FROM events WHERE slno = ?',[prodSl]);
        if(isDeleted){
            const img = eventExist[0].event_image;
            const url = img;
            const parts = url.split('/'); 
            const filename = parts[parts.length - 1];
            const imagePath = path.join('public/images', filename);
            fs.unlinkSync(imagePath);

          
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
            message : 'Failed No Such Event.'
        })
    }
}

module.exports = DelEvent;