const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RedeemCode = sequelize.define('RedeemCode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: '兑换码已存在'
    },
    validate: {
      notEmpty: {
        msg: '请提供兑换码'
      }
    },
    set(value) {
      this.setDataValue('code', value.toUpperCase().trim());
    }
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请提供积分数量'
      },
      min: {
        args: [1],
        msg: '积分必须大于0'
      }
    }
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  usedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请提供过期时间'
      }
    }
  }
}, {
  tableName: 'redeem_codes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['isUsed']
    }
  ]
});

module.exports = RedeemCode;
