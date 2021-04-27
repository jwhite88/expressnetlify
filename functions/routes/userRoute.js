const express = require('express');
const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

/* router.route('path').get(req,res).post(req,res).put().delete(req,res)
** OR router.get('path',req,res), router.post('path',req,res), router.put('path',req,res), router.delete('path',req,res)
*/
router.route('/users')
    .get(async (req, res) => { 
        //res.json({user: "In the user endpoint"})
        //res.json({Hey: 'users'})
        const myuser = await User({});
        console.log('myuser Collection:', myuser.collection);
        await User.find({}, (err, docs) => {
           // console.log(docs);
            res.json(docs)
         })
    })
    .post((req, res) => { 
        const { firstname, lastname, email, password } = req.body;
        // use Model.prototype.save
        const user = new User({
            firstname,
            lastname,
            email,
            password
        });

        user.save((err, doc) => {
            if (err) {
                return console.error(err);
            } else {
                console.log(`${doc} inserted successfully!!`);
              return  res.json({ data: "Data has been saved" })
            }
         })
    })
    .put((req, res) => { 

    })
    .delete((req, res) => { 

    });

    router.route('/login')
        .get((req, res) => { 
            res.json({login: "login endpoint"})
        })
        .post((req, res) => { 
            User.findOne({ email: req.body.email }, (err, userDoc) => { 
                if (err) {
                    return console.error(err); 
                } else {
                    if (bcrypt.compareSync(req.body.password, userDoc.password)) {
                        const token = jwt.sign({firstname: userDoc.firstname}, 'myStrongSecretKey', {expiresIn: '1h'});
                        res.json({ status: "success", message: "user was found!!", data: {user: userDoc, token: token}})
                    } else {
                        res.json({status: "error", message: "Invalid email or password", data: null})
                    }
                }
            });
        })
    


module.exports = router;

//console.log(express);