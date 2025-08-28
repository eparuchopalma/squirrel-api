'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('funds', [
      {
        id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
        name: 'Main',
        balance: 200,
        is_main: true,
        user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      },
      {
        id: 'e90780b3-a464-464b-9073-82ead2dc3ece',
        name: 'Savings',
        balance: 1500,
        is_main: false,
        user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      }
    ], {})
    await queryInterface.bulkInsert('records', [{
      id: '9fac9d25-40cd-4741-9c0b-0eef8c8f0dab',
      user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      fund_id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
      correlated_fund_id: null,
      date: '2025-01-01 08:14:01+00',
      type: 1,
      amount: 1000,
      note: '',
      tag: 'Salary',
    },
    {
      id: '9fac9d25-40cd-4741-9c0b-0eef8c8f0dac',
      user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      fund_id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
      correlated_fund_id: null,
      date: '2025-01-05 08:15:01+00',
      type: 1,
      amount: 1000,
      note: '',
      tag: 'Bonus',
    },
    {
      id: '9fac9d25-40cd-4741-9c0b-0eef8c8f0dad',
      user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      fund_id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
      correlated_fund_id: 'e90780b3-a464-464b-9073-82ead2dc3ece',
      date: '2025-01-06 08:15:01+00',
      type: 0,
      amount: -1500,
      note: '',
      tag: 'F2F',
    },
    {
      id: '9fac9d25-40cd-4741-9c0b-0eef8c8f0dae',
      user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      fund_id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
      correlated_fund_id: null,
      date: '2025-01-03 08:30:01+00',
      type: 2,
      amount: -200,
      note: 'Rent',
      tag: 'Home',
    },
    {
      id: '9fac9d25-40cd-4741-9c0b-0eef8c8f0daf',
      user_id: 'demo0|17e80a13x5dc1e726a2ae73',
      fund_id: 'e90780b3-a464-464b-9073-82ead2dc3dcd',
      correlated_fund_id: null,
      date: '2025-01-02 17:30:01+00',
      type: 2,
      amount: -100,
      note: 'Groceries',
      tag: 'Home',
    },

  ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id: 'demo0|17e80a13x5dc1e726a2ae73' }, {});
  }

};
