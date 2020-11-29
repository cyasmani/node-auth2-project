const router = require('express').Router()
const users = require('../users/users-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets")
const { first } = require('../db-config')

router.post('/register', async (req, res) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password, 10)
    user.password = hash

    try {
        const saved = await users.add(user)
        res.status(201).json(saved)
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
})

router.post('/login', (req,res) => {
   let {username, password} = req.body 
    users.findBy({username})
    .first()
    .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
            //req.session.user = user;
            const token = generateToken(user)
            res.status(200).json({message:`welcome ${user.username}`, token})
        } else {
            res.status(401).json({message: 'invalid creds'})
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

router.get('logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send("You will be here forever")
            } else {
                res.send("You haved logged out")
            }
        });
    } else {
        res.end()
    }
})

function generateToken(user) {

    const payload ={
        subject: user.id,
        username: user.username,
        role: user.role
    };
    const options = {
        expiresIn: "1 day"
    };
    const secret = secrets.jwtSecret
    return jwt.sign(payload, secret, options)
}

module.exports = router