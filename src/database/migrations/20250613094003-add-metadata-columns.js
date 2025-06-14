'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Products', 'updatedAt', { type: Sequelize.DATE }),
      queryInterface.addColumn('Products', 'createdAt', { type: Sequelize.DATE }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Products', 'updatedAt'),
      queryInterface.removeColumn('Products', 'createdAt'),
    ]);
  }
};
