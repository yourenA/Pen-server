'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('tags', [{
      name:'javascript',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'html',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'css',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'css3',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'nodejs',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'mysql',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'express',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'koa',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('tags', null, {});
  }
};
