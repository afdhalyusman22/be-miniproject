const { Sequelize } = require("sequelize");

const db = require("../config/db/postgres");
const Farm = require("../models/Farm");
const Pond = require("../models/Pond");

const FarmPond = db.define("farm_pond", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    farm_id: {
        type: Sequelize.INTEGER,
    },
    pond_id: {
        type: Sequelize.INTEGER,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});

FarmPond.belongsTo(Farm, {
    foreignKey: "farm_id",
    as: "farm"
});
FarmPond.belongsTo(Pond, {
    foreignKey: "pond_id",
    as: "pond"
});

module.exports = FarmPond;
