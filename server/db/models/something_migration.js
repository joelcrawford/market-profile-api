'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class something_migration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  something_migration.init({
    something: DataTypes.STRING,
    time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'something_migration',
  });
  return something_migration;
};