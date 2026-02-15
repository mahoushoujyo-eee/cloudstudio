package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

// HeartbeatRequest 心跳请求结构体
type HeartbeatRequest struct {
	UserID      int64  `json:"user_id" binding:"required"`
	InstanceID  int64  `json:"instance_id" binding:"required"`
	RecordID    int64  `json:"record_id"`
	CreatorID   int64  `json:"creator_id"`
	StartTime   string `json:"start_time" binding:"required"`
	CurrentTime string `json:"current_time" binding:"required"`
}

// HeartbeatRecord 存储在 Redis 中的心跳记录
type HeartbeatRecord struct {
	ID               int64      `json:"id"`
	UserID           int64      `json:"user_id"`
	InstanceID       int64      `json:"instance_id"`
	StartTime        time.Time  `json:"start_time"`
	EndTime          time.Time `json:"end_time"`
	CreatorID        int64      `json:"creator_id"`
	CreationTime     time.Time  `json:"creation_time"`
	ModifierID       int64      `json:"modifier_id"`
	ModificationTime time.Time  `json:"modification_time"`
}

var redisClient *redis.Client
var ctx = context.Background()

func initRedis() {
	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost:6379"
	}

	redisClient = redis.NewClient(&redis.Options{
		Addr:     redisHost,
		Password: "",
		DB:       0,
	})

	// 测试连接
	_, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Redis 连接失败: %v", err)
	}
	log.Printf("Redis 连接成功: %s", redisHost)
}

// HandleHeartbeat 处理心跳请求
func HandleHeartbeat(c *gin.Context) {
	var req HeartbeatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "参数错误: " + err.Error(),
		})
		return
	}

	// 解析开始时间
	startTime, err := time.Parse(time.RFC3339, req.StartTime)
	if err != nil {
		// 尝试其他格式
		startTime, err = time.Parse("2006-01-02T15:04:05Z", req.StartTime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    400,
				"message": "start_time 格式错误，请使用 RFC3339 格式",
			})
			return
		}
	}

	endTime, err := time.Parse(time.RFC3339, req.CurrentTime)
	if err != nil {
		// 尝试其他格式
		endTime, err = time.Parse("2006-01-02T15:04:05Z", req.CurrentTime)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    400,
				"message": "current_time 格式错误，请使用 RFC3339 格式",
			})
			return
		}
	}

	now := time.Now()

	// 构建记录
	record := HeartbeatRecord{
		ID:               req.RecordID,
		UserID:           req.UserID,
		InstanceID:       req.InstanceID,
		StartTime:        startTime,
		EndTime:          endTime,
		CreatorID:        req.CreatorID,
		CreationTime:     startTime,
		ModifierID:       req.UserID,
		ModificationTime: now,
	}

	// 生成 Redis key: heartbeat:{user_id}:{instance_id}
	redisKey := fmt.Sprintf("cloudstudio-heart:%d:%d", req.UserID, req.InstanceID)

	// 序列化为 JSON
	jsonData, err := json.Marshal(record)
	if err != nil {
		log.Printf("JSON 序列化失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "内部错误",
		})
		return
	}

	// 写入 Redis，设置过期时间（5 分钟）
	err = redisClient.Set(ctx, redisKey, jsonData, 5*time.Minute).Err()
	if err != nil {
		log.Printf("Redis 写入失败: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "存储心跳失败",
		})
		return
	}

	log.Printf("心跳已记录: user_id=%d, instance_id=%d, key=%s", req.UserID, req.InstanceID, redisKey)

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "心跳接收成功",
		"data": gin.H{
			"user_id":     req.UserID,
			"instance_id": req.InstanceID,
			"timestamp":   now.Format(time.RFC3339),
		},
	})
}

// HandleHealthCheck 健康检查
func HandleHealthCheck(c *gin.Context) {
	// 检查 Redis 连接
	_, err := redisClient.Ping(ctx).Result()
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status":  "unhealthy",
			"message": "Redis 连接异常",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().Format(time.RFC3339),
	})
}

func main() {
	// 加载 .env 文件
	err := godotenv.Load()
	if err != nil {
		log.Println("警告: 无法加载 .env 文件，使用默认配置")
	}

	// 初始化 Redis
	initRedis()

	// 获取端口
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// 创建 Gin 路由器
	r := gin.Default()

	// 注册路由
	r.POST("/heartbeat", HandleHeartbeat)
	r.GET("/health", HandleHealthCheck)

	log.Printf("Gin 服务器启动，监听端口: %s", port)
	log.Printf("心跳接口: POST http://localhost:%s/heartbeat", port)
	log.Printf("健康检查: GET http://localhost:%s/health", port)

	// 启动服务器
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}
