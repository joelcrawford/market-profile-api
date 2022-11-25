'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class binance_klines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  binance_klines.init({
    id: DataTypes.UUID,
    exchange: DataTypes.STRING,
    symbol: DataTypes.STRING,
    period: DataTypes.STRING,
    time: DataTypes.DATE,
    open: DataTypes.FLOAT,
    close: DataTypes.FLOAT,
    low: DataTypes.FLOAT,
    high: DataTypes.FLOAT,
    volume: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'binance_klines',
  });
  return binance_klines;
};