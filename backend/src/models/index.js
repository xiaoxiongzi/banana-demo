const User = require('./User');
const GenerationHistory = require('./GenerationHistory');
const Order = require('./Order');
const RedeemCode = require('./RedeemCode');

// 定义模型关联

// User 和 GenerationHistory 的关联
User.hasMany(GenerationHistory, {
  foreignKey: 'userId',
  as: 'generations'
});
GenerationHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User 和 Order 的关联
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User 和 RedeemCode 的关联（使用者）
User.hasMany(RedeemCode, {
  foreignKey: 'usedBy',
  as: 'redeemedCodes'
});
RedeemCode.belongsTo(User, {
  foreignKey: 'usedBy',
  as: 'usedByUser'
});

module.exports = {
  User,
  GenerationHistory,
  Order,
  RedeemCode
};


