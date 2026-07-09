const sequelize = require("../utils/dbConfig");
const { DataTypes } = require("sequelize");

const Expense = sequelize.define("expenses", 
    {id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },

    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
}
)

module.exports =Expense