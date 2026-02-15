@echo off
echo 正在编译 Linux 可执行文件...

REM 设置环境变量用于交叉编译
set GOOS=linux
set GOARCH=amd64
set CGO_ENABLED=0

REM 编译 Linux 可执行文件
go build -a -installsuffix cgo -o heartbeater-linux .

if %ERRORLEVEL% EQU 0 (
    echo Linux 可执行文件编译成功: heartbeater-linux
) else (
    echo 编译失败！
    exit /b 1
)

echo.
echo 正在构建 Docker 镜像...

REM 构建 Docker 镜像
docker build -t heartbeater:latest .

if %ERRORLEVEL% EQU 0 (
    echo Docker 镜像构建成功: heartbeater:latest
    echo.
    echo 可以使用以下命令运行容器:
    echo docker run --rm heartbeater:latest
    echo.
    echo 如果需要挂载自定义的 .env 文件:
    echo docker run --rm -v %cd%\.env:/root/.env heartbeater:latest
) else (
    echo Docker 镜像构建失败！
    exit /b 1
)

echo.
echo 构建完成！
