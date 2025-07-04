import sequelize from "../../config/db.js";
import DataTypes from "sequelize";

const Game = sequelize.define("game", {
    gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    gameName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameImg: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gameDesc: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timesPlayed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    gameRoute: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "/"
    }
},
{
  freezeTableName: true,
});

export default Game;