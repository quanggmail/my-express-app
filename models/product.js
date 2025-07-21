// models/product.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                min: 0.00
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
      size: {
            type: DataTypes.STRING,
            allowNull: true,       
           
        },
        code: {
            type: DataTypes.STRING, 
            allowNull: true,       
            unique: true           
        }
        
    }, {
        tableName: 'products',
        timestamps: true,
        // ... other options
    });

    // ... associations if any ...

    return Product;
};