const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GenerationHistory = sequelize.define('GenerationHistory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请提供提示词'
      },
      len: {
        args: [1, 2000],
        msg: '提示词最多2000个字符'
      }
    }
  },
  model: {
    type: DataTypes.ENUM('banana', 'banana-pro', 'banana-pro-stable'),
    allowNull: false,
    defaultValue: 'banana'
  },
  aspectRatio: {
    type: DataTypes.ENUM('1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'),
    allowNull: false,
    defaultValue: '1:1'
  },
  inputImages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  outputImage: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  creditsUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: '积分不能为负数'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('generating', 'completed', 'failed'),
    allowNull: false,
    defaultValue: 'completed'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  }
}, {
  tableName: 'generation_histories',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'createdAt']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = GenerationHistory;
