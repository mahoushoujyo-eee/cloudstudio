# Mini-CloudStudio

> 一个深度融合云原生技术与大模型能力的在线集成开发环境（Cloud IDE）与智能教学平台

Mini-CloudStudio 参考腾讯云 CloudStudio 实现，旨在通过云端容器化技术实现"开发环境即服务"，并结合 AI 赋能课程创作。项目采用 Kubernetes Operator 自研控制器实现开发容器（Pod）的高效调度与全生命周期管理，支持用户按需租用云端工作站。同时引入基于 Eino 与 Hertz 框架构建的 AI Agent 服务，利用大模型自动生成实战课程；后端基于 Spring Boot 构建稳健的业务中台，并针对高并发场景设计了基于 Go 语言的分布式心跳监测与计时微服务。

---

## 项目架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        cloud-studio-ui                           │
│                    (React 19 + Vite 前端)                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│cloud-studio-  │       │cloud-studio-  │       │cloud-studio-  │
│    biz        │       │    agent      │       │  extension    │
│(Spring Boot)  │       │(Hertz + AI)   │       │  (4个微服务)   │
│  业务后端      │       │  AI 助手服务   │       │  心跳/同步     │
└───────┬───────┘       └───────────────┘       └───────┬───────┘
        │                                               │
        │         ┌─────────────────────────┐          │
        └────────►│    cloud-studio-operator │◄─────────┘
                  │   (Kubernetes Operator)  │
                  │    管理云端开发环境实例     │
                  └───────────┬──────────────┘
                              │
                              ▼
                  ┌─────────────────────────┐
                  │     Kubernetes 集群      │
                  │  ┌─────────┐  ┌───────┐ │
                  │  │code-    │  │heart- │ │
                  │  │server   │  │beat   │ │
                  │  └─────────┘  └───────┘ │
                  │  ┌─────────┐  ┌───────┐ │
                  │  │   PVC   │  │HTTP   │ │
                  │  │ (持久化) │  │Route  │ │
                  │  └─────────┘  └───────┘ │
                  └─────────────────────────┘
```

---

## 技术栈

| 模块 | 技术栈 | 说明 |
|------|--------|------|
| **cloud-studio-ui** | React 19 + Vite 7 + Framer Motion | 前端用户界面 |
| **cloud-studio-biz** | Spring Boot 3.5 + Java 21 + MyBatis | 核心业务后端 |
| **cloud-studio-agent** | Go 1.23 + Hertz + Eino | AI Agent 服务 |
| **cloud-studio-operator** | Go 1.24 + Kubebuilder + Controller Runtime | K8s 控制器 |
| **cloud-studio-extension** | Go + Redis + Kafka + MySQL | 心跳监控微服务 |

---

## 模块详解

### 1. cloud-studio-ui（前端）

基于 React 19 和 Vite 7 构建的现代化前端应用，提供完整的用户体验。

**核心功能：**
- 首页展示平台功能
- 学习中心：课程浏览与学习
- 课程创建：AI 辅助课程生成
- 应用市场：应用浏览与详情
- 模板中心：模板资源管理
- 用户中心：个人设置

**技术特性：**
- React Router Dom 7 路由管理
- Axios HTTP 客户端
- Framer Motion 动画
- MDXEditor 编辑器
- 响应式设计

```bash
cd cloud-studio-ui
npm install
npm run dev
```

---

### 2. cloud-studio-biz（业务后端）

基于 Spring Boot 3.5 构建的核心业务服务，提供完整的业务逻辑支撑。

**核心功能：**
- 课程管理：课程创建、章节管理、学习记录
- 应用管理：应用发布、评论、点赞
- 用户管理：用户信息、时间记录
- 资源管理：OSS 文件上传

**技术特性：**
- Spring Boot 3.5.8 + Java 21
- MyBatis 3.0.5 ORM
- Redis 缓存 + Spring Cache
- 阿里云 OSS 对象存储
- Knife4j API 文档

```bash
cd cloud-studio-biz
mvn spring-boot:run
```

---

### 3. cloud-studio-agent（AI 服务）

基于 Hertz 和 Eino 框架构建的 AI Agent 服务，提供智能对话和课程生成能力。

**核心功能：**
- 出行路线规划助手：使用高德地图和 12306 工具
- 景点推荐助手：推荐周边景点
- 网络搜索助手：使用 Jina/Fetch 工具
- 课程生成助手：自动生成课程大纲和内容

**技术特性：**
- Hertz 高性能 HTTP 框架
- Eino AI Agent 框架
- 火山引擎 Ark（豆包模型）+ OpenAI
- Milvus 向量数据库
- Redis 对话记忆
- SSE 流式响应

```bash
cd cloud-studio-agent
go mod tidy
go run main.go
```

---

### 4. cloud-studio-operator（K8s 控制器）

基于 Kubebuilder 构建的 Kubernetes Operator，管理 Cloud Studio 实例的完整生命周期。

**核心功能：**
- 资源创建：Namespace, StorageClass, PVC, Deployment, Service, HTTPRoute
- 状态管理：Pause/Resume 功能
- 持久化存储：PVC 管理工作空间数据
- 网络路由：Gateway API HTTPRoute 暴露服务

**CRD 示例：**
```yaml
apiVersion: cloud-studio.example.com/v1alpha1
kind: CloudStudio
metadata:
  name: my-studio
spec:
  codeServerImage: codercom/code-server:latest
  userId: "user-123"
  instanceId: "instance-456"
  storageSize: 10Gi
  cpuLimit: "1"
  memoryLimit: "1Gi"
  status: running  # running | paused
```

**部署方式：**
```bash
cd cloud-studio-operator
make deploy
```

---

### 5. cloud-studio-extension（心跳微服务）

针对高并发场景设计的分布式心跳监测与计时微服务，采用"Redis内存高频聚合 + SyncDB 异步批量落库MySQL"的双层架构方案。

**服务组成：**

| 服务 | 技术栈 | 功能 |
|------|--------|------|
| HeartBeater | Go + Kafka + Cron | 定时发送心跳（每 10 秒） |
| HeartbeatServer | Go + Hertz + Redis | 接收心跳请求，存储 Redis |
| HeartCollector | Go + Gin + Redis | 收集心跳数据 API |
| SyncDB | Go + Redis + GORM + MySQL | 定时同步到 MySQL（每分钟） |

**数据流：**
```
[Pod] -> HeartBeater -> Kafka -> HeartbeatServer -> Redis -> SyncDB -> MySQL
                        ↑
                  HeartCollector (HTTP API)
```

**设计优势：**
- 高吞吐：Redis 内存聚合
- 最终一致性：异步批量落库
- 容错性：Kafka 消息队列

---

## 快速开始

### 环境要求

- Node.js >= 18
- Go >= 1.23
- Java >= 21
- Kubernetes >= 1.28
- Redis
- MySQL
- Kafka（可选）

### 本地开发

```bash
# 1. 克隆项目
git clone <repository-url>
cd cs

# 2. 启动前端
cd cloud-studio-ui && npm install && npm run dev

# 3. 启动业务后端
cd cloud-studio-biz && mvn spring-boot:run

# 4. 启动 AI 服务
cd cloud-studio-agent && go mod tidy && go run main.go

# 5. 启动心跳服务（按需）
cd cloud-studio-extension/HeartbeatServer && go run main.go
cd cloud-studio-extension/HeartCollector && go run main.go
cd cloud-studio-extension/SyncDB && go run main.go
```

### Kubernetes 部署

```bash
# 部署 Operator
cd cloud-studio-operator
make deploy

# 创建 CloudStudio 实例
kubectl apply -f config/samples/
```

---

## 项目结构

```
cs/
├── cloud-studio-ui/          # 前端应用
│   ├── src/
│   │   ├── pages/           # 页面组件
│   │   ├── components/      # 公共组件
│   │   ├── api/             # API 接口
│   │   └── contexts/        # 状态管理
│   └── package.json
│
├── cloud-studio-biz/         # 业务后端
│   ├── src/main/java/
│   │   ├── controllers/     # REST 控制器
│   │   ├── services/        # 业务服务
│   │   ├── dao/             # MyBatis Mapper
│   │   └── entities/        # 实体类
│   └── pom.xml
│
├── cloud-studio-agent/       # AI Agent 服务
│   ├── biz/
│   │   ├── agent/           # Agent 实现
│   │   ├── config/          # 配置
│   │   └── service/         # 业务逻辑
│   └── go.mod
│
├── cloud-studio-operator/    # K8s Operator
│   ├── api/v1alpha1/        # CRD 定义
│   ├── internal/controller/ # 控制器
│   └── config/              # Kustomize 配置
│
└── cloud-studio-extension/   # 心跳微服务
    ├── HeartBeater/         # 心跳发送器
    ├── HeartbeatServer/     # 心跳服务器
    ├── HeartCollector/      # 心跳收集器
    └── SyncDB/              # 数据库同步器
```

---

## 核心特性

### 云原生架构
- 基于 Kubernetes 的容器编排
- 自定义 CRD 实现声明式管理
- Gateway API 网络路由

### AI 能力集成
- Eino 框架构建 AI Agent
- 多模型支持（豆包、OpenAI）
- 流式响应（SSE）
- 向量检索（Milvus）

### 高并发设计
- Redis 内存聚合
- 异步批量落库
- Kafka 消息队列
- 分布式微服务

---

## License

MIT License
