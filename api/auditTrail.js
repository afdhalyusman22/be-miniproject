const express = require('express');
const AuditTrail = require('../models/AuditTrail');
const {
    Op,
    Sequelize
} = require("sequelize");
const _ = require('lodash');

require("dotenv").config();

const router = express.Router();

router.get('/', async (req, res) => {
    let audit_trail = await AuditTrail.findAll();
    if(audit_trail.length === 0)
        return res.status(404).send({
            message: 'not found'
        });

    audit_trail = audit_trail.map(item => {
        return item.dataValues;
    });

    let auditTrailGrouped = _(audit_trail)
        .groupBy(x => x.endpoint)
        .map((value, key) => ({
            endpoint: key,
            data: _(value)
                .groupBy(x => x.username)
                .map((value, key) => ({
                    username: key,
                    count: value.length
                }))
                .sortBy('username')
                .value()
        }))
        .sortBy('endpoint')
        .value();

    return res.status(200).send({
        message: 'Success',
        data: auditTrailGrouped
    });

});

module.exports = router;