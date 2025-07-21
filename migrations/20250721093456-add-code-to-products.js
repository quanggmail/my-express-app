'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add the 'code' column to the 'products' table
    await queryInterface.addColumn('products', 'code', {
      type: Sequelize.STRING, // Or TEXT, INTEGER, etc., based on your 'code' format
      allowNull: true,       // Decide if this column can be null
      unique: true,          // If product codes must be unique
      // defaultValue: 'DEFAULT_CODE', // Optional: provide a default value
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('products', 'code');
  }
};
