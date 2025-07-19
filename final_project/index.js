const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const multer = require('multer');
const upload = multer();

app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/customer",session({
    secret:"fingerprint_customer",
    resave: true, 
    saveUninitialized: true
    })
)

app.use("/customer/auth/*", function auth(req,res,next){
    if (req.session && req.session.authorization && req.session.authorization.username) {
        next();
    }else{
        return res.status(401).json({ message: "Unauthorized: Please log in first" });
    }
});
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
