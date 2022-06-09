const { Sequelize } = require("sequelize");

const db = require("../config/db/postgres");

const AuditTrail = db.define("audit_trail", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(255),
    },
    endpoint: {
        type: Sequelize.TEXT,
    },
    created_at: {
        type: Sequelize.STRING,
    },
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = AuditTrail;
