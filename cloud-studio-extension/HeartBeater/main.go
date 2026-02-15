package main

import (
	"encoding/json"
	"log"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/IBM/sarama"
	"github.com/joho/godotenv"
	"github.com/robfig/cron/v3"
)

// ---------- 全局 Kafka 生产者 ----------
var producer sarama.SyncProducer

func initProducer() {
	cfg := sarama.NewConfig()
	cfg.Producer.Return.Successes = true
	cfg.Producer.Return.Errors = true
	cfg.Producer.RequiredAcks = sarama.WaitForAll // 高可靠
	cfg.Producer.Retry.Max = 3

	brokers := []string{os.Getenv("KAFKA_BROKERS")} // 格式：localhost:9092
	if len(brokers) == 0 || brokers[0] == "" {
		log.Fatal("环境变量 KAFKA_BROKERS 未设置")
	}

	var err error
	producer, err = sarama.NewSyncProducer(brokers, cfg)
	if err != nil {
		log.Fatalf("创建 Kafka 生产者失败: %v", err)
	}
}

// ---------- 组装并发送 ----------
func sendHeartbeat(topic string) {
	userIDStr := os.Getenv("USER_ID")
	instanceIDStr := os.Getenv("INSTANCE_ID")
	startTimeStr := os.Getenv("START_TIME")
	creatorIDStr := os.Getenv("CREATOR_ID")
	recordIDStr := os.Getenv("RECORD_ID")

	if userIDStr == "" || instanceIDStr == "" {
		log.Println("环境变量缺失，跳过本次心跳")
		return
	}

	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil || userID < 0 {
		log.Println("userID 非法:", err)
		return
	}

	instanceID, err := strconv.ParseInt(instanceIDStr, 10, 64)
	if err != nil || instanceID < 0 {
		log.Println("instanceID 非法:", err)
		return
	}

	var recordID int64 = 0
	if recordIDStr != "" {
		recordID, _ = strconv.ParseInt(recordIDStr, 10, 64)
	}

	var creatorID int64 = 0
	if creatorIDStr != "" {
		creatorID, _ = strconv.ParseInt(creatorIDStr, 10, 64)
	}

	now := time.Now()
	var startTime time.Time
	if startTimeStr != "" {
		startTime, err = time.Parse(time.RFC3339, startTimeStr)
		if err != nil {
			startTime = now
		}
	} else {
		startTime = now
	}

	record := ApplicationActivityRecord{
		ID:               recordID,
		UserID:           userID,
		InstanceID:       instanceID,
		StartTime:        startTime,
		CreatorID:        creatorID,
		CreationTime:     startTime,
		ModifierID:       userID,
		ModificationTime: now,
	}

	value, err := json.Marshal(record)
	if err != nil {
		log.Println("JSON 编码失败:", err)
		return
	}

	msg := &sarama.ProducerMessage{
		Topic: topic,
		Key:   sarama.StringEncoder(userIDStr), // 按 UserID 做分区键
		Value: sarama.ByteEncoder(value),
	}

	partition, offset, err := producer.SendMessage(msg)
	if err != nil {
		log.Printf("Kafka 发送失败: %v", err)
		return
	}
	log.Printf("心跳已发送 -> partition=%d offset=%d", partition, offset)
}

// ---------- 主流程 ----------
func main() {
	// 加载 .env 文件
	err := godotenv.Overload()
	if err != nil {
		log.Println("警告: 无法加载 .env 文件:", err)
	}

	topic := os.Getenv("KAFKA_TOPIC")
	if topic == "" {
		topic = "pod-heartbeat" // 默认主题
	}

	initProducer()
	defer func() {
		if err := producer.Close(); err != nil {
			log.Println("关闭生产者失败:", err)
		}
	}()

	// 定时任务：每 10 秒
	c := cron.New(cron.WithSeconds())
	_, err = c.AddFunc("*/10 * * * * *", func() { sendHeartbeat(topic) })
	if err != nil {
		log.Fatal("添加 cron 失败:", err)
	}
	c.Start()
	log.Println("Kafka 心跳定时任务已启动...")

	// 优雅退出
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
	log.Println("收到终止信号，停止任务...")
	c.Stop()
}
