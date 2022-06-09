const { Sequelize } = require("sequelize");

const db = require("../config/db/postgres");

const User = db.define("user", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(50),
    },
    email: {
        type: Sequelize.STRING(100),
    },
    password: {
        type: Sequelize.STRING(255),
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
}, {
    freezeTableName: true
});

module.exports = User;