const express = require('express');
const FarmPond = require('../models/FarmPond');
const Farm = require('../models/Farm');
const Pond = require('../models/Pond');
const {
    Op
} = require("sequelize");
require("dotenv").config();
const router = express.Router();
const _ = require('lodash');

router.get('/', async (req, res) => {
    try {
        const data = await FarmPond.findAll({
            include: [{
                    model: Farm,
                    as: 'farm',
                    attributes: ['name', 'id']
                },
                {
                    model: Pond,
                    as: 'pond',
                    attributes: ['name', 'id']
                }
            ],
            order: [
                ['id', 'DESC']
            ],
        });
        res.status(200).send({
            message: 'success',
            data
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

router.post('/', async (req, res) => {
    try {
        let roleId = req.body.role_id;
        let menus = req.body.menu_id;
        const cekExist = await RoleMenu.findOne({
            attributes: ['role_id', 'menu_id'],
            where: {
                [Op.and]: [{
                    role_id: roleId
                }, {
                    menu_id: menus
                }]
            }
        });
        
        if (cekExist != null) {
            return res.status(400).send({
                message: "mapping role-menu already exist"
            })
        }

        let insert_data = RoleMenu.create({
            role_id: roleId,
            menu_id: menus,
        });

        if (!insert_data) {
            return res.status(400).send({
                message: "Error in insert new record"
            })
        }

        return res.send({
            message: 'Created'
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error"
        })
    }
});

module.exports = router;