'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      imgPath: {
        type: Sequelize.STRING(64),
      },
      productType: {
        type: Sequelize.STRING(32),
      },
      displayName: {
        type: Sequelize.STRING(64),
      },
      department: {
        type: Sequelize.STRING(32),
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      color: {
        type: Sequelize.STRING(16),
      },
      price: {
        type: Sequelize.INTEGER,
      },
      material: {
        type: Sequelize.STRING(16),
      },
      ratings: {
        type: Sequelize.INTEGER,
      },
      sales: {
        type: Sequelize.INTEGER,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};
