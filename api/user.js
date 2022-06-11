const express = require('express');
const {
    Op
} = require("sequelize");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dboUser = require('../models/Users');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const getUser = await dboUser.findAll({
            attributes: ['id', 'username', 'email'],
            order: [
                ['id', 'DESC']
            ],
        });
        res.status(200).send({
            message: 'success',
            data: getUser
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await dboUser.findOne({
            attributes: ['id', 'username', 'email'],
            where: {
                id: req.params.id
            }
        });
        return res.status(200).send({
            message: 'Success',
            data: user
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await dboUser.destroy({
            where: {
                id: req.params.id
            }
        })
        return res.send({
            message: `Success delete id ${req.params.id}`
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }

});

router.post('/change/forgot/password', async (req, res) => {
    try {
        const password = req.body.password;
        const repeat_password = req.body.repeat_password;

        if (password !== repeat_password) {
            return res.status(400).send('Password dont match');
        }

        let pass = await bcrypt.hash(password, 10);

        return dboUser.update({
            password: pass,
        }, {
            where: {
                id: req.user.id
            }
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'Updated'
                });
            } else {
                res.status(400).send('Error in update new record');
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }

});

router.put('/:id', async (req, res) => {
    try {

        let user = await dboUser.findOne({
            where: {
                id: req.params.id
            }
        });

        if (user == null) {
            return res.status(404).send({
                message: 'Data Not Found'
            });
        }

        let email = req.body.email ? req.body.email : user.email;
        let username = req.body.username ? req.body.username : user.username;
        let pass = req.body.password == null || req.body.password == '' ? 'D3los.2022' : req.body.password;

        if (pass == null) {
            pass = user.password;
        } else {
            pass = await bcrypt.hash(pass, 10);
        }

        return dboUser.update({
            email: email,
            username: username,
            password: pass,
        }, {
            where: {
                id: req.params.id
            }
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'Updated'
                });
            } else {
                res.status(400).send('Error in update new record');
            }
        });

    } catch (error) {

        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

module.exports = router;