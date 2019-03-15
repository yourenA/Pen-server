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
    return queryInterface.bulkInsert('code_categories', [{
      name:'前端',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'NodeJs',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'数据库',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name:'摄影',
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
    return queryInterface.bulkDelete('code_category', null, {});
  }
};
