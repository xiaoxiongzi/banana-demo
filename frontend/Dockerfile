# 使用官方 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 移除默认的 nginx 配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义的 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/

# 复制构建好的前端文件到 nginx 的 html 目录
COPY dist/ /usr/share/nginx/html/

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

