const dbConnection = require('../config/Db')

async  function GetAllReports(req, res, next){
    try{
        const   [reports] = await dbConnection.query('SELECT * FROM report ORDER BY slno DESC');
        if(reports.length>0){
            await   Promise.all(
                reports.map(async(per)=>{
                    if(per.event_or_not == 'not event'){
                        var [prdData] = await dbConnection.query('SELECT * FROM product WHERE slno = ?',[per.product_slno]);
                        if(prdData.length>0){
                            per.image = prdData[0].image1;
                            per.name = prdData[0].name;
                            per.serial = prdData[0].slno;
                        }
                    }else{
                        var [prdData] = await dbConnection.query('SELECT * FROM event_products WHERE slno = ?',[per.product_slno]);
                        if(prdData.length>0){
                            per.image = prdData[0].image1;
                            per.name = prdData[0].name;
                            per.serial = prdData[0].slno;
                        }
                    }

                    var [usermail] = await dbConnection.query('SELECT email FROM user WHERE slno = ?',[per.user_slno]);
                    per.usermail = usermail[0].email;


                    var [seller] = await dbConnection.query('SELECT email,address,mobile FROM seller WHERE slno = ?',[per.seller_slno]);
                    per.sellermail = seller[0].email;
                    per.selleraddress = seller[0].address;
                    per.sellercontact = seller[0].mobile;

                    var [price] = await dbConnection.query('SELECT price FROM delivery_order WHERE slno = ?',[per.deliveryserial]);
                    per.price = price[0].price;


                })
            )

            return  res.status(200).json({
                message : 'Success',
                reports : reports
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

module.exports = GetAllReports;