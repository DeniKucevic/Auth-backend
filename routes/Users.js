const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');
users.use(cors())

users.post('/register', (req, res) => {
    const time = new Date();
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: req.body.password,
        generation: req.body.generation,
        created: time
    }

    User.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                userData.password = hash;
                User.create(userData).then(
                    (user) => {
                        res.status(201)
                        res.json({ message: user.username + ' ' + 'is succsesfully registrated!' })
                    }).catch((err) => {
                        res.status(500)
                        res.send('error' + err)
                    })
            })
        } else {
            res.status(406)
            res.json({ error: 'user already exists' })
        }
    }).catch((err) => {
        res.status(500)
        res.send('error' + err)
    })
})

users.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                //password is matching
                const payload = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: '4h'
                })
                res.status(200)
                res.json({ token: token })
            } else {
                //password is not matching
                res.status(401)
                res.json({ error: 'user does not exist' })
            }
        } else {
            res.status(401)
            res.json({ error: 'user does not exist' })
        }
    }).catch((err) => {
        res.status(500)
        res.send('error' + err)
    })
})

users.get('/profile', (req, res) => {

    let decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        _id: decoded._id
    }).then((user) => {
        if (user) {
            res.status(200)
            res.json(user)
        } else {
            res.status(401)
            res.send('user does not exist')
        }
    }).catch((err) => {
        res.status(500)
        res.send('error' + err)
    })
})

users.get('/user', (req, res) => {
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401)
            res.send('Invalid token')
        } else {
            User.findOne({
                username: req.body.username
            }).then((user) => {
                if (user) {
                    res.status(200)
                    res.json(user)
                } else {
                    res.status(401)
                    res.send('user does not exist')
                }
            }).catch((err) => {
                res.status(500)
                res.send('error' + err)
            })
        }
    })
})

users.get('/', (req, res) => {
    jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401)
            res.send('Invalid token')
        } else {
            User.find().then((users) => {
                if (users) {
                    res.status(200)
                    res.json(users)
                } else {
                    res.status(401)
                    res.send('users does not exist')
                }
            }).catch((err) => {
                res.status(500)
                res.send('error' + err)
            })
        }
    })
})

module.exports = users