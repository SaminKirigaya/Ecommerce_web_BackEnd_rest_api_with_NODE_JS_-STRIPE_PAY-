
# Ecommerce_web_Backend_rest_api_with_NODE_JS

This is the backend rest api for ecommerce web product.
The main concern is to authenticate and authorize every rest api and make browsing and transaction secured.
There are 3 segments of api here :
- Employee
- Seller
- Buyer
Based on the login of user one will be activated.

## Features

-   Full Authentication and Authorization Based.
-   Secured transaction with stripe sandbox api payment.
-   Cash on Delivery system.
-   Tokenized system
-   Hashed system
-   Images are processed in size before saved in dataabse with Jimp.
-   Nodemailer is used to send verification or account creation successfull messages.
-  Product Report, Like, Dislike handle. 
-   Event And Regular product segment   are handled with different system.
 
## Lessons Learned

-   Node Js
- Nodemailer
- Express Js
- Joi
-   Multer
-   Bcrypt
-   Fs
-   Path
-   Stripe Api Payment
-   Cash on Delivery system
- Mysql
-   DotEnv
- Cors


## Optimizations

The most important thing which you must remember is that you have to change .env file and adjust it according to your hosting.I ran the project in localhost.

PORT = 8000
Imgpath = http://localhost:8000
Host = localhost
User = root
Pass = 
DB = ecommerce
smtpMail = 
smtpPass = 
Secret_Key = 


-   Port means which port to run it.
-   Imgpath is a link starting root address ... I used express.static to save image inside public/images.
so the image link was like :
http://localhost:8000/public/images/imagename.jpg


-   smtp mail and pass are you smtp creation provided one.

-   Finally, Secret Key is provided from    stripe payment website when you make your id. Its for making sandbox api payment system.

## Run Locally

Clone the project

```bash
  git clone https://github.com/SaminKirigaya/Ecommerce_web_BackEnd_rest_api_with_NODE_JS.git

```

Go to the project directory

```bash
  cd my-project
  //your project saving directory name
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

