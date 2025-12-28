const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'banana_ai',
  process.env.MYSQL_USERNAME || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT) || 3306,
    dialect: 'mysql',
    timezone: '+08:00',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// 连接数据库
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL 连接成功');
    
    // 同步模型到数据库（开发环境）
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✅ 数据库模型同步完成');
    }
  } catch (error) {
    console.error('❌ MySQL 连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
