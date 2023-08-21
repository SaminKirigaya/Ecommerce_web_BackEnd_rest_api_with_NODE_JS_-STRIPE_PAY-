const dbConnection = require('../config/Db');

async function getmyproductDeliveryStatus(req, res, next){
    try{
        const {usersl} = req.params;
        const {postSL} = req.body;
        const [delData] = await dbConnection.query('SELECT delivery_status,uuid,name,estimeted_delivery FROM delivery_order WHERE slno = ? AND user_slno = ?',[postSL, usersl]);
        if(delData.length>0){


            if(delData[0].delivery_status == 'On Process'){
                return  res.status(200).json({
                    message : 'Success',
                    onprocess : true,
                    packaged : false,
                    fordelivery : false,
                    delivered : false,
                    uuid : delData[0].uuid,
                    name : delData[0].name,
                    delDate : delData[0].estimeted_delivery
                })

            }else if(delData[0].delivery_status == 'Packaged'){
                return  res.status(200).json({
                    message : 'Success',
                    onprocess : true,
                    packaged : true,
                    fordelivery : false,
                    delivered : false,
                    uuid : delData[0].uuid,
                    name : delData[0].name,
                    delDate : delData[0].estimeted_delivery
                })

            }else if(delData[0].delivery_status == 'For Delivery'){

                return  res.status(200).json({
                    message : 'Success',
                    onprocess : true,
                    packaged : true,
                    fordelivery : true,
                    delivered : false,
                    uuid : delData[0].uuid,
                    name : delData[0].name,
                    delDate : delData[0].estimeted_delivery
                })

            }else if(delData[0].delivery_status == 'Delivered'){
                return  res.status(200).json({
                    message : 'Success',
                    onprocess : true,
                    packaged : true,
                    fordelivery : true,
                    delivered : true,
                    uuid : delData[0].uuid,
                    name : delData[0].name,
                    delDate : delData[0].estimeted_delivery
                })
            }


        }else{
            return res.status(200).json({
                message : 'Failed'
            })
        }

    }catch(err){
        next(err);
    }
}

module.exports = getmyproductDeliveryStatus;