'use strict';
const DataType = require('sequelize').DataTypes;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('funds', {
      id: { type: DataType.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: DataType.STRING, allowNull: false },
      balance: { type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      is_main: { type: DataType.BOOLEAN, allowNull: false, defaultValue: false },
      user_id: { type: DataType.STRING, allowNull: false },
    });

    await queryInterface.createTable('records', {
      id: { type: DataType.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      date: { type: DataType.DATE, allowNull: false },
      type: { type: DataType.INTEGER, allowNull: false },
      amount: { type: DataType.DECIMAL(12, 2), allowNull: false },
      tag: { type: DataType.STRING },
      note: { type: DataType.STRING },
      user_id: { type: DataType.STRING, allowNull: false },
      fund_id: { type: DataType.UUID, allowNull: false, references: { model: 'funds', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'NO ACTION' },
      correlated_fund_id: { type: DataType.UUID, allowNull: true, references: { model: 'funds', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'NO ACTION' },
    });

    await queryInterface.addIndex('records', ['fund_id']);
    await queryInterface.addIndex('records', ['correlated_fund_id']);
    await queryInterface.addConstraint('records', {
      fields: ['user_id', 'date'],
      type: 'unique',
      name: 'unique_user_date_constraint'
    });
    await queryInterface.addConstraint('funds', {
      fields: ['user_id', 'name'],
      type: 'unique',
      name: 'unique_user_name_constraint',
    });
    await queryInterface.addConstraint('funds', {
      fields: ['amount'],
      type: 'check',
      where: {
        amount: { [Sequelize.Op.gte]: 0 }
      },
      name: 'check_amount_non_negative',
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('records');
    await queryInterface.dropTable('funds');
  }
};
