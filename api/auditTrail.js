const express = require('express');
const AuditTrail = require('../models/AuditTrail');
const {
    Op,
    Sequelize
} = require("sequelize");
const moment = require("moment");
let now = moment().format("DD-MM-YYYY-HH:mm:ss");

require("dotenv").config();

const router = express.Router();

router.get('/', (req, res) => {
    return AuditTrail.findAll({}).then(function (data) {
        if (data.length < 1) {
            res.send({
                message: 'Not Found'
            });
        } else {
            res.send({
                message: 'Found',
                data: data
            });
        }
    }).catch(error => {
        return res.status(400).send('Error in create new record');
    });
});

router.post('/', async (req, res) => {
    try {
        return AuditTrail.create({
            username: req.body.username,
            menu: req.body.menu,
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'Created'
                });
            } else {
                res.status(400).send('Error in create new record');
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