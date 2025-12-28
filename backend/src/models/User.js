const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: {
      msg: '用户名已存在'
    },
    validate: {
      notEmpty: {
        msg: '请提供用户名'
      },
      len: {
        args: [3, 30],
        msg: '用户名长度必须在3到30个字符之间'
      }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: '邮箱已被注册'
    },
    validate: {
      notEmpty: {
        msg: '请提供邮箱'
      },
      isEmail: {
        msg: '请提供有效的邮箱地址'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: '请提供密码'
      },
      len: {
        args: [6, 255],
        msg: '密码至少6个字符'
      }
    }
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: {
        args: [0],
        msg: '积分不能为负数'
      }
    }
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    defaultValue: ''
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    }
  ],
  hooks: {
    // 密码加密钩子
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// 实例方法：验证密码
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 实例方法：获取公开信息
User.prototype.toPublicJSON = function() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    credits: this.credits,
    avatar: this.avatar,
    role: this.role,
    createdAt: this.createdAt
  };
};

module.exports = User;
