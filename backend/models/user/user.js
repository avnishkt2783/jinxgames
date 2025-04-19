import DataTypes from "sequelize"
import sequelize from "../../config/db.js"

const user = sequelize.define('user',{
    userId:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        unique:true
    },
    userName:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isLoggedIn:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    isPlaying:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    createdAt:{
        type:DataTypes.DATE,
        allowNull:false,
        defaultValue: DataTypes.NOW
    },
},
{
    freezeTableName: true
});

export default user