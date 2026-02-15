# 构建阶段
FROM golang:1.24-alpine AS builder

WORKDIR /app

# 复制 go mod 文件
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 构建 Linux 二进制文件
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o syncer .

# 运行阶段 - 使用极简 Alpine 镜像
FROM alpine:latest

# 安装 ca-certificates 用于 HTTPS 请求
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# 从构建阶段复制二进制文件
COPY --from=builder /app/syncer .

# 复制 .env 文件
COPY --from=builder /app/.env .

# 运行应用程序
CMD ["./syncer"]
