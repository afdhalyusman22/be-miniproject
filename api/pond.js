const express = require('express');
const Pond = require('../models/Pond');
const FarmPond = require('../models/FarmPond');
const Farm = require('../models/Farm');
require("dotenv").config();
const router = express.Router();
const {
    Op
} = require("sequelize");
const {
    result
} = require('lodash');

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
        let pond = await Pond.findOne({
            where: {
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        });
        if (!pond)
            return res.status(404).send({
                message: 'Not Found'
            });
        //cek relation farm & pond
        let farm_pond = await FarmPond.findAll({
            where: {
                pond_id: req.params.id
            },
            include: [{
                model: Farm,
                as: 'farm',
                attributes: ['name', 'id']
            }],
        });

        let result = {
            ...pond.dataValues,
            farm: farm_pond.map(item => {
                return item.dataValues.farm;
            })
        }

        return res.status(200).send({
            message: 'Success',
            data: result
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

        let farm_id = req.body.farm_id;

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

        let ponds = await Pond.create({
            name: req.body.name
        });

        if (ponds && farm_id) {
            let farm = await Farm.findOne({
                where: {
                    [Op.and]: [{
                        id: farm_id
                    }, {
                        is_deleted: false
                    }],
                }
            });

            if (!farm)
                return res.status(200).send({
                    message: 'Pond Created, but failed register to Farm because farm not exist'
                });

            return FarmPond.create({
                farm_id: farm_id,
                pond_id: ponds.id
            }).then(function (data) {
                if (data) {
                    res.send({
                        message: 'Pond Created & success register to farm'
                    });
                } else {
                    res.status(200).send({
                        message: 'Pond Created, but failed register to Farm'
                    });
                }
            }).catch(function () {
                res.status(200).send({
                    message: 'Pond Created, but failed register to Farm'
                });

            });
        }

        return res.status(200).send({
            message: 'Pond Created'
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
        let ponds, farm;
        let farm_id = req.body.farm_id;

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

        //get farm master by id
        if (farm_id) {
            farm = await Farm.findOne({
                where: {
                    [Op.and]: [{
                        id: farm_id
                    }, {
                        is_deleted: false
                    }],
                }
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


        //if pond not exist create new pond
        if (!pond) {
            ponds = await Pond.create({
                name: req.body.name
            });
            //if farm_id exist in request body
            if (ponds && farm_id) {
                if (!farm)
                    return res.status(200).send({
                        message: `${req.body.name} not exist. But system already created new the pond & failed register to Farm because farm not exist `
                    });

                return FarmPond.create({
                    farm_id: farm_id,
                    pond_id: ponds.id
                }).then(function (data) {
                    if (data) {
                        res.send({
                            message: 'Pond Updated & success register to farm'
                        });
                    } else {
                        res.status(200).send({
                            message: 'Pond Updated, but failed register to Farm'
                        });
                    }
                }).catch(function () {
                    res.status(200).send({
                        message: 'Pond Updated, but failed register to Farm'
                    });

                });
            }

            //return if farm_id not exist in request body
            return res.status(200).send({
                message: `${req.body.name} not exist. But system already created new the pond`
            });
        }

        ponds = await Pond.update({
            name: req.body.name
        }, {
            where: {
                [Op.and]: [{
                    id: req.params.id
                }, {
                    is_deleted: false
                }],
            }
        })

        if (ponds && farm_id) {
            if (!farm)
                return res.status(200).send({
                    message: `${req.body.name} not exist. but failed register to Farm because farm not exist `
                });

            //cek pond_id already register to farm
            let farm_pond = await FarmPond.findOne({
                where: {
                    pond_id: req.params.id
                }
            });

            //if pond_id exist, update relation farm pond
            if (farm_pond) {
                let update_farm_pond = await FarmPond.update({
                    farm_id: farm_id
                }, {
                    where: {
                        pond_id: req.params.id
                    }
                })

                if (update_farm_pond)
                    return res.status(200).send({
                            message: 'Pond Updated & relation farm & pond success updated'
                        });

                return res.status(200).send({
                            message: 'Pond Updated & relation farm & pond failed updated'
                        });

            }

            return FarmPond.create({
                farm_id: farm_id,
                pond_id: req.params.id
            }).then(function (data) {
                if (data) {
                    res.send({
                        message: 'Pond Updated & success register to farm'
                    });
                } else {
                    res.status(200).send({
                        message: 'Pond Updated, but failed register to Farm'
                    });
                }
            }).catch(function () {
                res.status(200).send({
                    message: 'Pond Updated, but failed register to Farm'
                });

            });
        }

        return res.status(200).send({
            message: 'Pond Updated'
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