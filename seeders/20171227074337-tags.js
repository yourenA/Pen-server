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
      r:212,
      g:97,
      b:97,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'html',
      createdAt: new Date(),
      r:224,
      g:140,
      b:65,
      updatedAt: new Date()
    },{
      name:'css',
      r:232,
      g:41,
      b:136,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'css3',
      r:187,
      g:49,
      b:222,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'nodejs',
      r:68,
      g:219,
      b:224,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'mysql',
      r:212,
      g:97,
      b:97,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'express',
      r:255,
      g:25,
      b:62,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'koa',
      r:212,
      g:97,
      b:97,
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
