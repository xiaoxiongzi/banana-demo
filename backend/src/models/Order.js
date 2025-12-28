const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
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
  packageType: {
    type: DataTypes.ENUM('basic', 'pro', 'premium', 'enterprise'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请选择套餐类型'
      }
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请提供订单金额'
      },
      min: {
        args: [0],
        msg: '金额不能为负数'
      }
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
        args: [0],
        msg: '积分不能为负数'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('alipay', 'wechat', 'credit_card', 'mock'),
    allowNull: false,
    defaultValue: 'mock'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: ''
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
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

module.exports = Order;
