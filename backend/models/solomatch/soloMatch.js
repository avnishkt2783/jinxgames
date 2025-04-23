import sequelize from "../../config/db.js";
import { DataTypes } from "sequelize";
import User from "../user/user.js";
import Game from "../game/game.js";

const soloMatch = sequelize.define("SoloMatch", {
  matchId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  endTime: {
    type: DataTypes.DATE,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  outcome: {
    type: DataTypes.STRING, 
  },
  metadata: {
    type: DataTypes.JSON,
  }
}, {
  freezeTableName: true,
});

soloMatch.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(soloMatch, { foreignKey: 'userId' });

soloMatch.belongsTo(Game, { foreignKey: 'gameId', onDelete: 'CASCADE' });
Game.hasMany(soloMatch, { foreignKey: 'gameId' });

export default soloMatch;
