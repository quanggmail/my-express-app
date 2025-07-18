const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
            allowNull : false
        },
        username : {
            type : DataTypes.STRING,
            allowNull : false,
            unique: true
        },
        password : {
            type : DataTypes.STRING,
            allowNull: false,
            
        }
    });

    return User;
};