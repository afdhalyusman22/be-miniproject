const express = require('express');
const Farm = require('../models/Farm');
require("dotenv").config();
const router = express.Router();
const {
    Op
} = require("sequelize");

router.get('/', async (req, res) => {
    try {
        let farm = await Farm.findAll({
            where: {
                is_deleted: false
            },
            order: [
                ['id', 'DESC']
            ],
        });

        if (farm.length === 0)
            return res.status(404).send({
                message: 'Not Found'
            });

        return res.status(200).send({
            message: 'Success',
            data: farm
        });

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.get('/:id', async (req, res) => {
    try {

        let farm = await Farm.findByPk(req.params.id);
        if (!farm)
            return res.status(404).send({
                message: 'Not Found'
            });

        return res.status(200).send({
            message: 'Success',
            data: farm
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.post('/', async (req, res) => {
    try {

        let farm = await Farm.findOne({
            where: {
                [Op.and]: [{
                    name: req.body.name
                }, {
                    is_deleted: false
                }],
                
            }
        });

        if (farm) {
            return res.status(400).send({
                message: `${req.body.name} already exist`
            });
        }

        return Farm.create({
            name: req.body.name
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'Farm Created'
                });
            } else {
                res.status(400).send({
                    message: 'Error in insert new record'
                });
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
        let farm = await Farm.findOne({
            where: {
                [Op.and]: [{
                    name: req.body.name
                }, {
                    is_deleted: false
                }],
                [Op.not]: [{
                    id: req.params.id
                }]
            }
        });

        //if farm name exist return error
        if (farm) {
            return res.status(400).send({
                message: `${req.body.name} already exist`
            });
        }

        farm = await Farm.findOne({
            where: {                               
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        });

        if (!farm) {
            return Farm.create({
                name: req.body.name
            }).then(function (data) {
                if (data) {
                    res.send({
                        message: `${req.body.name} not exist. But system already created new the farm.`
                    });
                } else {
                    res.status(400).send({
                        message: 'Error in insert new record'
                    });
                }
            });
        }        

        return Farm.update({
            name: req.body.name
        }, {
            where: {                               
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'Farm Updated'
                });
            } else {
                res.status(400).send({
                    message: 'Error in update new record'
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error"
        })
    }

});

router.delete('/:id', async (req, res) => {
    try {

        let farm = await Farm.findOne({
            where: {          
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        });
        if (farm == null) {
            return res.status(404).send({
                message: 'Farm not exist'
            });
        }
        await Farm.update({
            is_deleted: true,
            deleted_at: new Date()
        }, {
            where: {
                id: req.params.id
            }
        })
        return res.send({
            message: `Success delete id ${req.params.id}`
        });

    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error"
        })
    }
});

module.exports = router;