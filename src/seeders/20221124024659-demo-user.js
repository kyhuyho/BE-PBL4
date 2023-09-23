"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // up: (queryInterface, Sequelize) => {
  //   return queryInterface.bulkInsert("Users", [
  //     {
  //       id: "A1",
  //       firstName: "John",
  //       lastName: "Doe",
  //       email: "example@example.com",
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     },
  //   ]);
  // },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
