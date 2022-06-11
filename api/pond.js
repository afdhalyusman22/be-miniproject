const express = require('express');
const Pond = require('../models/Pond');
require("dotenv").config();
const router = express.Router();
const {
    Op
} = require("sequelize");

router.get('/', async (req, res) => {
    try {
        let pond = await Pond.findAll({
            where: {
                is_deleted: false
            },
            order: [
                ['id', 'DESC']
            ],
        });

        if (pond.length === 0)
            return res.status(404).send({
                message: 'Not Found'
            });

        return res.status(200).send({
            message: 'Success',
            data: pond
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

        let pond = await Pond.findByPk(req.params.id);
        if (!pond)
            return res.status(404).send({
                message: 'Not Found'
            });

        return res.status(200).send({
            message: 'Success',
            data: pond
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

        let pond = await Pond.findOne({
            where: {
                [Op.and]: [{
                    name: req.body.name
                }, {
                    is_deleted: false
                }],
                
            }
        });

        if (pond) {
            return res.status(400).send({
                message: `${req.body.name} already exist`
            });
        }

        return Pond.create({
            name: req.body.name
        }).then(function (data) {
            if (data) {
                res.send({
                    message: 'pond Created'
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
        let pond = await Pond.findOne({
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

        //if pond name exist return error
        if (pond) {
            return res.status(400).send({
                message: `${req.body.name} already exist`
            });
        }

        pond = await Pond.findOne({
            where: {                
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        });

        if (!pond) {
            return Pond.create({
                name: req.body.name
            }).then(function (data) {
                if (data) {
                    res.send({
                        message: `${req.body.name} not exist. But system already created new the pond.`
                    });
                } else {
                    res.status(400).send({
                        message: 'Error in insert new record'
                    });
                }
            });
        }        

        return Pond.update({
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
                    message: 'Pond Updated'
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

        let pond = await Pond.findOne({
            where: {         
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        });
        if (pond == null) {
            return res.status(404).send({
                message: 'pond not exist'
            });
        }
        await Pond.update({
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