const { Sequelize } = require("sequelize");

const db = require("../config/db/postgres");

const Farm = db.define("farm", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(255),
    },
    created_at: {
        type: Sequelize.STRING,
    },
    is_deleted: {
        type: Sequelize.BOOLEAN,
    },
    deleted_at: {
        type: Sequelize.DATE,
    },
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Farm;
