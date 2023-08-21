require('dotenv').config()
const dbConnection = require('../config/Db')
const path = require('path');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe')(process.env.Secret_Key); 



async function paymentCard(req, res, next){
    try{
        const {usersl} = req.params;
        const {token, amount} = req.body;
        
        try{
            

            const customer = await Stripe.customers.create({
                email: token.email, // Use the email from the token
                source: token.id, // Use the token ID as the payment method source
              });

            
            const paymentIntent = await Stripe.paymentIntents.create({
                amount: amount, // Amount in cents
                currency: 'inr',
                payment_method_types: ['card'],
                payment_method: token.card.id, // Use the card ID from the token's card object
                customer: customer.id, 
                confirm: true,
                   
            })

            console.log(paymentIntent)

            if (paymentIntent.status === 'requires_action') {
                // Return client_secret and requires_action to the frontend
                console.log('1')
                return res.status(200).json({
                    requires_action: true,
                    client_secret: paymentIntent.client_secret,
                    payment_method: paymentIntent.payment_method,
                });
            } else if (paymentIntent.status === 'succeeded') {
               
                return res.status(200).json({
                    message: 'Success',
                    paymentIntent: paymentIntent,
                });
            } else {
                // Handle other paymentIntent statuses
                console.log('3')
                return res.status(500).json({
                    message: 'Payment failed',
                });
            }
   

        }catch(err){
            return  res.status(200).json({
                message : 'Failed Purchasing.'
            })
        }
        

    }catch(err){
        next(err)
    }
    
}

module.exports= paymentCard;