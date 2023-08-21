require('dotenv').config()
const dbConnection = require('../config/Db')
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to true if you're using port 465 with SSL/TLS
    auth: {
      user: process.env.smtpMail,
      pass: process.env.smtpPass,
    },
  });


async function ConcodDel(req, res, next){
    try{
        const {usersl} = req.params;
        const [incart] = await dbConnection.query('SELECT * FROM cart WHERE user_slno = ?',[usersl]);
        if(incart.length>0){
            const [userData] = await dbConnection.query('SELECT * FROM user WHERE slno = ?',[usersl]);
            // Get the current date
            const currentDate = new Date();

            // Add 5 days to the current date
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + 5);
            const futureFormattedDate = formatDate(futureDate);

            // Save the future date in a constant
            const delDate = futureFormattedDate;
            var uuids = [];


            await   Promise.all(
            incart.map(async(per)=>{
                if(per.event_or_not == 'not event'){
                    var buyno = uuidv4();
                    var   [prdData] = await dbConnection.query('SELECT price,name FROM product WHERE slno = ?',[per.product_slno]);
                    var   price = per.myamount*prdData[0].price;
                    await dbConnection.query('INSERT INTO delivery_order (product_slno, user_slno, seller_slno, payment_option, estimeted_delivery, price, delivery_address, delivery_status, amount, event_or_not, uuid, name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[per.product_slno, per.user_slno, per.seller_slno, 'Cash On Delivery', delDate, price, userData[0].delivery_address, 'On Process', per.myamount, per.event_or_not, buyno, prdData[0].name]);
                    uuids.push(buyno);
                }else{
                    var buyno = uuidv4();
                    var   [prdData] = await dbConnection.query('SELECT price,name FROM event_products WHERE slno = ?',[per.product_slno]);
                    var   price = per.myamount*prdData[0].price;
                    await dbConnection.query('INSERT INTO delivery_order (product_slno, user_slno, seller_slno, payment_option, estimeted_delivery, price, delivery_address, delivery_status, amount, event_or_not, uuid, name) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',[per.product_slno, per.user_slno, per.seller_slno, 'Cash On Delivery', delDate, price, userData[0].delivery_address, 'On Process', per.myamount, per.event_or_not, buyno, prdData[0].name]);
                    uuids.push(buyno);
                }
            })
            )
            var totalPrice = 0;
            const   [orders] = await dbConnection.query('SELECT * FROM delivery_order WHERE uuid in (?)',[uuids]);

            orders.map((perit)=>{
                totalPrice += perit.price;
            })

            let htmlTable = '<table style="border-collapse: collapse; width: 100%; border: 1px solid cyan; color: cyan; background-color: #1b1b1b;">';
            htmlTable += '<thead><tr><th>Name</th><th>Amount</th><th>Price</th></tr></thead>';
            htmlTable += '<tbody>';
            for (const order of orders) {
            htmlTable += `<tr><td style="text-align: center;">${order.name}</td><td style="text-align: center;">${order.amount}</td><td style="text-align: center;">${order.price}/=</td></tr>`;
            }
            htmlTable += '</tbody></table>';

            const mailOptions = {
                from: 'EShopBD.com', // Sender address (must be your Gmail address)
                to: `${userData[0].email}`,           // Recipient address
                subject: 'Order Buying Confirmation.',            // Subject of the email
                html: `
                <h1>EshopBD.com</h1>
                <h4>Your Orders Are Confirmed ...</h4>
                ${htmlTable}
                <h4>Total Price = ${totalPrice}/=</h4>
                `,
            };

            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    return res.status(200).json({
                        message : 'Some Error Occured.'
                    })
                } else {
                    await dbConnection.query('DELETE FROM cart WHERE user_slno = ?',[usersl]);
                    return res.status(200).json({
                        message : 'Success'
                    })
                }
            });




        }else{
            return  res.status(200).json({
                message : 'Failed ...'
            })
        }

    }catch(err){
        next(err)
    }
}

module.exports = ConcodDel;