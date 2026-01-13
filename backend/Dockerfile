FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json yarn.lock ./
RUN yarn install --production

# 复制源码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["yarn", "start"]

