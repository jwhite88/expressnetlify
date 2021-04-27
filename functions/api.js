const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const serverless = require('serverless-http')
require("dotenv").config()
const cors = require('cors');
const userRouter = require('./routes/userRoute');
const jwt = require('jsonwebtoken');

const app = express();

const approuter = express.Router()

// mongoose.connect('mongodb://localhost:27017/userSampleDB', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// })
//     .then(() => { console.log("MongoDB connected"); })
//     .catch(() => { console.log("error connecting to MongoDB"); });

mongoose.connect(`mongodb+srv://jwhite:${process.env.MYPASS}@cluster0.gbtpj.mongodb.net/userSampleDB?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => { console.log("MongoDB connected to Atlas"); })
    .catch(() => { console.log("error connecting to MongoDB Atlas"); });


// console.log(bodyParser)
/* NOTE Middleware ror parsing json Objects */
// app.use(bodyParser.json());
app.use(express.json())
/* NOTE Middleware for parsing bodies from URL  */
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }))

approuter.get('/', (req, res) => {
    res.json({ hello: 'world' })
})

app.use('/v1', userRouter);

approuter.get('/v1/testauth', validateUser, (req, res) => {
    res.json({ endpoing: "this endpoint is authenicated" });
})

app.use('/.netlify/functions/api', userRouter)
app.use('/.netlify/functions/api', approuter)

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], 'myStrongSecretKey', function (err, decoded) {
        console.log("The access Header: ", req.headers['x-access-token']);
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}



// app.listen(4000, () => {
//     console.log(`Server started on 4000`);
// });

module.exports.handler = serverless(app)