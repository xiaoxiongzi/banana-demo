# 前端 Docker + Nginx 部署指南

## 部署步骤

### 1. 准备工作

确保你已经：
- ✅ 在本地构建了 `dist` 文件夹（运行 `yarn build`）
- ✅ 服务器已安装 Docker

### 2. 上传文件到服务器

将以下文件上传到服务器的同一个目录下（例如：`/home/user/banana-frontend/`）：

```
banana-frontend/
├── dist/              # 构建好的前端文件
├── Dockerfile         # Docker 配置文件
├── nginx.conf         # Nginx 配置文件
└── .dockerignore      # Docker 忽略文件
```

你可以使用以下命令上传（在本地终端执行）：

```bash
# 使用 scp 上传（替换 your-server 为你的服务器地址）
scp -r dist Dockerfile nginx.conf .dockerignore user@your-server:/home/user/banana-frontend/

# 或者使用 rsync
rsync -avz --progress dist/ Dockerfile nginx.conf .dockerignore user@your-server:/home/user/banana-frontend/
```

### 3. 修改 Nginx 配置

在服务器上编辑 `nginx.conf` 文件，修改后端代理地址：

```bash
# 登录服务器后
cd /home/user/banana-frontend/
nano nginx.conf  # 或使用 vi/vim
```

找到以下两处，将 `http://your-backend-host:3000` 替换为你实际的后端地址：

```nginx
location /api/ {
    proxy_pass http://your-backend-host:3000;  # ← 修改这里
    ...
}

location /uploads/ {
    proxy_pass http://your-backend-host:3000;  # ← 修改这里
    ...
}
```

例如，如果后端在同一台服务器的 3000 端口：
- `http://localhost:3000`
- `http://127.0.0.1:3000`

如果后端在其他服务器：
- `http://backend.example.com:3000`
- `http://10.0.0.5:3000`

### 4. 构建 Docker 镜像

在服务器上执行：

```bash
cd /home/user/banana-frontend/

# 构建镜像
docker build -t banana-frontend:latest .
```

### 5. 运行容器

```bash
# 停止并删除旧容器（如果存在）
docker stop banana-frontend 2>/dev/null || true
docker rm banana-frontend 2>/dev/null || true

# 运行新容器
docker run -d \
  --name banana-frontend \
  -p 5678:80 \
  --restart unless-stopped \
  banana-frontend:latest
```

**参数说明：**
- `-d`：后台运行
- `--name banana-frontend`：容器名称
- `-p 5678:80`：将容器的 80 端口映射到主机的 5678 端口
- `--restart unless-stopped`：自动重启（除非手动停止）

如果 5678 端口被占用，可以改为其他端口，例如 8080：
```bash
docker run -d \
  --name banana-frontend \
  -p 8080:80 \
  --restart unless-stopped \
  banana-frontend:latest
```

### 6. 验证部署

```bash
# 查看容器状态
docker ps | grep banana-frontend

# 查看容器日志
docker logs banana-frontend

# 测试访问
curl http://localhost
```

访问你的服务器 IP 或域名即可看到网站。

### 7. 常用管理命令

```bash
# 停止容器
docker stop banana-frontend

# 启动容器
docker start banana-frontend

# 重启容器
docker restart banana-frontend

# 查看日志
docker logs -f banana-frontend

# 进入容器内部（调试用）
docker exec -it banana-frontend sh

# 删除容器
docker stop banana-frontend && docker rm banana-frontend

# 删除镜像
docker rmi banana-frontend:latest
```

### 8. 更新部署

当你需要更新前端代码时：

```bash
# 1. 重新构建 dist 并上传到服务器

# 2. 重新构建镜像
docker build -t banana-frontend:latest .

# 3. 停止并删除旧容器
docker stop banana-frontend && docker rm banana-frontend

# 4. 启动新容器
docker run -d \
  --name banana-frontend \
  -p 5678:80 \
  --restart unless-stopped \
  banana-frontend:latest
```

或者使用一键脚本：

```bash
#!/bin/bash
docker build -t banana-frontend:latest . && \
docker stop banana-frontend 2>/dev/null || true && \
docker rm banana-frontend 2>/dev/null || true && \
docker run -d --name banana-frontend -p 5678:80 --restart unless-stopped banana-frontend:latest && \
echo "部署成功！"
```

### 9. 使用 HTTPS（可选）

如果需要 HTTPS，建议使用 Nginx 或 Caddy 作为反向代理，配置 SSL 证书。

#### 方案 A：使用宿主机 Nginx + Let's Encrypt

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 配置 Nginx 反向代理到 Docker 容器
```

#### 方案 B：在 Docker 容器中配置 SSL

修改 Dockerfile，添加证书文件和 HTTPS 配置。

### 10. 性能优化建议

- ✅ 已配置 Gzip 压缩
- ✅ 已配置静态资源缓存
- ✅ 使用轻量级的 `nginx:alpine` 镜像

### 故障排查

**问题：无法访问网站**
```bash
# 检查容器是否运行
docker ps | grep banana-frontend

# 检查端口是否被占用
netstat -tlnp | grep 5678

# 检查防火墙
sudo ufw status
sudo ufw allow 5678
```

**问题：API 请求失败**
- 检查 `nginx.conf` 中的后端地址是否正确
- 确保后端服务正在运行
- 查看容器日志：`docker logs banana-frontend`

**问题：路由刷新后 404**
- 已在 `nginx.conf` 中配置了 `try_files $uri $uri/ /index.html`，应该不会出现此问题
- 如果仍有问题，检查 Nginx 配置是否正确加载

## 联系与支持

如有问题，请检查：
1. Docker 容器日志
2. Nginx 错误日志（容器内 `/var/log/nginx/error.log`）
3. 浏览器开发者工具的网络请求

