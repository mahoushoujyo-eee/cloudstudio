package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
	gormmysql "gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// HeartbeatRecord Redis 中的心跳记录结构
type HeartbeatRecord struct {
	ID               int64  `json:"id"`
	UserID           int64  `json:"user_id"`
	InstanceID       int64  `json:"instance_id"`
	StartTime        string `json:"start_time"`
	EndTime          string `json:"end_time"`
	CreatorID        int64  `json:"creator_id"`
	CreationTime     string `json:"creation_time"`
	ModifierID       int64  `json:"modifier_id"`
	ModificationTime string `json:"modification_time"`
}

// ApplicationActivityRecord MySQL 表结构
type ApplicationActivityRecord struct {
	ID               int64     `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID           int64     `gorm:"not null;index" json:"user_id"`
	ApplicationID    int64     `gorm:"not null;index" json:"application_id"`
	StartTime        time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"start_time"`
	EndTime          time.Time `json:"end_time"`
	CreatorID        int64     `json:"creator_id"`
	CreationTime     time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"creation_time"`
	ModifierID       int64     `json:"modifier_id"`
	ModificationTime time.Time `gorm:"not null;default:CURRENT_TIMESTAMP" json:"modification_time"`
}

func (ApplicationActivityRecord) TableName() string {
	return "application_activity_record"
}

func getDB() (*gorm.DB, error) {
	dsn := os.Getenv("MYSQL_DSN")
	return gorm.Open(gormmysql.Open(dsn), &gorm.Config{})
}

func syncRedisToMySQL() error {
	log.Println("开始执行数据同步...")

	db, err := getDB()
	if err != nil {
		log.Printf("数据库连接失败: %v", err)
		return err
	}
	log.Println("数据库连接成功")

	// 从 Redis 中获取数据
	redisClient := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST"),
		DB:   0,
	})
	defer func() {
		if err := redisClient.Close(); err != nil {
			log.Printf("Warning: Failed to close Redis client: %v", err)
		}
	}()

	log.Printf("连接Redis: %s", os.Getenv("REDIS_HOST"))

	// 使用 HeartCollector 的 key 模式: cloudstudio-heart:*
	keys, err := redisClient.Keys(context.Background(), "cloudstudio-heart:*").Result()
	if err != nil {
		log.Printf("获取Redis keys失败: %v", err)
		return err
	}

	log.Printf("找到 %d 个Redis keys", len(keys))
	if len(keys) > 0 {
		log.Printf("Redis keys: %v", keys)
	}

	// 批量处理记录
	var records []ApplicationActivityRecord
	for _, key := range keys {
		data, err := redisClient.Get(context.Background(), key).Result()
		if err != nil {
			log.Printf("Warning: Failed to get key %s: %v", key, err)
			continue
		}

		// 先解析为 HeartbeatRecord（Redis 中的结构）
		var heartbeat HeartbeatRecord
		if err := json.Unmarshal([]byte(data), &heartbeat); err != nil {
			log.Printf("Warning: Failed to unmarshal data from key %s: %v", key, err)
			continue
		}

		// 解析时间字符串
		startTime, err := time.Parse(time.RFC3339, heartbeat.StartTime)
		if err != nil {
			startTime, err = time.Parse("2006-01-02T15:04:05Z", heartbeat.StartTime)
			if err != nil {
				log.Printf("Warning: 解析 start_time 失败: %v", err)
				continue
			}
		}

		var endTime time.Time
		if heartbeat.EndTime != "" {
			endTime, err = time.Parse(time.RFC3339, heartbeat.EndTime)
			if err != nil {
				endTime, err = time.Parse("2006-01-02T15:04:05Z", heartbeat.EndTime)
				if err != nil {
					log.Printf("Warning: 解析 end_time 失败: %v", err)
					continue
				}
			}
		}

		creationTime, err := time.Parse(time.RFC3339, heartbeat.CreationTime)
		if err != nil {
			creationTime, err = time.Parse("2006-01-02T15:04:05Z", heartbeat.CreationTime)
			if err != nil {
				log.Printf("Warning: 解析 creation_time 失败: %v", err)
				continue
			}
		}

		// 转换为 MySQL 记录
		now := time.Now()
		record := ApplicationActivityRecord{
			ID:               heartbeat.ID,
			UserID:           heartbeat.UserID,
			ApplicationID:    heartbeat.InstanceID,
			StartTime:        startTime,
			EndTime:          endTime,
			CreatorID:        heartbeat.CreatorID,
			CreationTime:     creationTime,
			ModifierID:       heartbeat.ModifierID,
			ModificationTime: now,
		}
		records = append(records, record)
	}

	log.Printf("准备同步 %d 条记录到MySQL", len(records))
	// 批量UPSERT操作
	// 使用 instance_id 和 start_time 组合作为唯一标识判断冲突
	// 批量UPSERT操作
	if len(records) > 0 {
		err := db.Clauses(clause.OnConflict{
			Columns: []clause.Column{{Name: "application_id"}, {Name: "start_time"}},
			DoUpdates: clause.Assignments(map[string]interface{}{
				"end_time":          gorm.Expr("VALUES(end_time)"),
				"modification_time": gorm.Expr("VALUES(modification_time)"),
			}),
		}).Create(&records).Error

		if err != nil {
			log.Printf("数据同步到MySQL失败: %v", err)
			return err
		}
		log.Printf("成功同步 %d 条记录到MySQL", len(records))

		// 同步成功后删除 Redis 中的记录
		log.Printf("开始删除 %d 个 Redis keys", len(keys))
		for _, key := range keys {
			if err := redisClient.Del(context.Background(), key).Err(); err != nil {
				log.Printf("Warning: 删除 Redis key %s 失败: %v", key, err)
			} else {
				log.Printf("已删除 Redis key: %s", key)
			}
		}
		log.Printf("成功删除 %d 个 Redis keys", len(keys))
	} else {
		log.Println("没有数据需要同步")
	}

	log.Println("数据同步完成")
	return nil
}

func main() {
	// 加载 .env 文件
	err := godotenv.Overload()
	if err != nil {
		log.Println("警告: 无法加载 .env 文件:", err)
	}

	// 打印环境变量检查
	log.Printf("MYSQL_DSN: %s", os.Getenv("MYSQL_DSN"))
	log.Printf("REDIS_HOST: %s", os.Getenv("REDIS_HOST"))

	// 启动时立即执行一次同步测试
	log.Println("启动时执行一次同步测试...")
	if err := syncRedisToMySQL(); err != nil {
		log.Printf("启动时同步测试失败: %v", err)
	}

	// 创建定时任务
	c := cron.New(cron.WithSeconds())
	_, err = c.AddFunc("0 */1 * * * *", func() {
		log.Printf("定时任务触发 - %s", time.Now().Format("2006-01-02 15:04:05"))
		if err := syncRedisToMySQL(); err != nil {
			log.Printf("syncRedisToMySQL failed: %v", err)
		}
	})
	if err != nil {
		log.Fatal("添加 cron 失败:", err)
	}

	c.Start()
	log.Println("数据同步定时任务已启动...")

	// 优雅退出
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
	log.Println("收到终止信号，停止任务...")
	c.Stop()
}
