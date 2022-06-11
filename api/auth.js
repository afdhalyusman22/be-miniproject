const express = require('express');
const {
    Op
} = require("sequelize");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dboUser = require('../models/Users');
const router = express.Router();

router.get('/ping', async (req, res) => {
    try {
        return res.status(200).send({
            message: 'Success'
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.post('/login', async (req, res) => {
    const password = req.body.password;

    // validation
    if (!req.body.email) {
        return res.status(400).send({
            message: 'Email is required',
        });
    }

    if (!req.body.password) {
        return res.status(400).send({
            message: 'Password is required',
        });
    }

    try {
        const email = req.body.email;

        const cekUser = await dboUser.findOne({
            attributes: ['id', 'username', 'email', 'password'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });

        if (cekUser !== null) {
            const cekPass = await bcrypt.compare(password, cekUser.password);
            if (cekPass == true) {

                const payload = {
                    id: cekUser.id,
                    username: cekUser.username,
                    email: cekUser.email,
                };
                jwt.sign(payload, process.env.TOKEN_SECRET, {
                    expiresIn: '1d'
                }, (err, token) => {
                    if (err) {
                        res.status(400).send(err);
                        console.log(err);
                    } else {
                        res.json({
                            message: 'Login Success',
                            token: token
                        });
                    }
                });
            } else {
                res.status(400).send({
                    message: 'Please check your email or password',
                });
            }
        } else {
            res.status(400).send({
                message: 'User not found'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        });
    }
});
router.post('/register', async (req, res) => {
    try {
        const email = req.body.email;
        const username = req.body.username;
        const pass = req.body.password == null || req.body.password == '' ? 'D3los.2022' : req.body.password;

        const cekUser = await dboUser.findOne({
            attributes: ['email'],
            where: {
                email: {
                    [Op.eq]: email
                }
            }
        });
        
        if (cekUser == null) {
            bcrypt.hash(pass, 10, async (err, hash) => {
                const password = hash;

                try {
                    const addUser = await dboUser.create({
                        email: email,
                        username: username,
                        password: password,
                    })

                    res.status(200).send({
                        message: 'Success add user'
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(400).send({
                        message: "Error"
                    })
                }
            })
        } else {
            res.status(400).send({
                status: 'Error',
                message: 'User already exist'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            message: "Error"
        })
    }
})

module.exports = router;