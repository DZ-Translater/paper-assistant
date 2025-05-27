#####################################
# 构建阶段
#####################################
FROM node:18-alpine AS build
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

#####################################
# 运行阶段
#####################################
FROM node:18-alpine AS production
WORKDIR /app

# 复制必要的文件
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/node_modules ./node_modules

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
