package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"travel/biz/agent"
	"travel/biz/config"
	"travel/biz/param"
	"travel/biz/util"

	"github.com/aliyun/alibabacloud-oss-go-sdk-v2/oss"
	"github.com/cloudwego/eino/adk"
	"github.com/cloudwego/eino/schema"
	"github.com/cloudwego/hertz/pkg/app"
	"github.com/spf13/viper"
)

type ChatService struct {
	ctx context.Context
	c   *app.RequestContext
}

func NewChatService(ctx context.Context, c *app.RequestContext) *ChatService {
	return &ChatService{
		ctx: ctx,
		c:   c,
	}
}

func (s *ChatService) Chat(request *param.ChatRequest, responseChan chan *param.SSEChatResponse) error {
	// 添加panic恢复机制，防止程序崩溃
	defer s.handleChatPanic(request, responseChan)

	conversationId := request.ConversationId
	messages, conversationId, err := agent.GetHistoryMessageList(s.ctx, conversationId, request.UserId, request.Prompt)
	if err != nil {
		return err
	}
	responseChan <- &param.SSEChatResponse{
		Type:           "start",
		ConversationId: conversationId,
	}

	// 使用封装的函数创建用户消息
	userMessage, err := agent.CreateUserMessageAndStore(s.ctx, conversationId, request.Prompt, request.ImgUrls)
	if err != nil {
		return err
	}
	messages = append(messages, userMessage)

	var userRunner *adk.Runner
	switch request.Agent {
	case "planner":
		userRunner = agent.DefaultPlanRunner
		log.Printf("\n使用计划助手: %v\n", request.Agent)
	case "recommender":
		userRunner = agent.DefaultRecommendRunner
		log.Printf("\n使用推荐助手: %v\n", request.Agent)
	case "course":
		userRunner = agent.DefaultCourseGeneratorRunner
		log.Printf("\n使用课程生成助手: %v\n", request.Agent)
	default:
		userRunner = agent.DefaultPlanRunner
	}
	iterator := userRunner.Run(s.ctx, messages)

	for {
		event, ok := iterator.Next()
		if !ok {
			log.Printf("\n迭代器异常或结束\n")
			break
		}
		log.Printf("\n event action: %v", event.Action)
		if event.Err != nil {
			// 记录详细错误信息
			log.Printf("\n事件处理错误: %v\n", event.Err)
			log.Printf("\n事件处理错误输出: %v\n", event.Output)

			// 发送错误信息到前端，让用户知道发生了什么
			errorMsg := s.formatToolError(event.Err)
			responseChan <- &param.SSEChatResponse{
				Type:           "error",
				Content:        errorMsg,
				ConversationId: conversationId,
			}

			// 如果是工具调用错误，尝试继续处理后续事件
			// 如果是其他严重错误，可能需要中断
			if s.isCriticalError(event.Err) {
				log.Printf("\n检测到严重错误，终止处理\n")
				break
			}

			continue // 跳过这个事件，继续处理下一个
		}

		// 添加nil检查，防止nil pointer dereference
		if event.Output == nil || event.Output.MessageOutput == nil {
			log.Printf("\n事件输出为空，跳过处理\n")
			continue
		}

		if event.Output.MessageOutput.IsStreaming {
			// TODO: 处理流式输出
			content := ""
			reasoningContent := ""
			stream := event.Output.MessageOutput.MessageStream

			// 检查stream是否为nil
			if stream == nil {
				log.Printf("\n流式传输stream为空，跳过处理\n")
				continue
			}

			for {
				msg, err := stream.Recv()
				if err != nil {
					// 检查是否是正常结束或可恢复的错误
					if err.Error() == "EOF" || msg == nil {
						log.Printf("\n流式传输正常结束\n")
						break
					}
					// 对于超时等网络错误，记录日志但不终止程序
					log.Printf("\n流式传输错误: %v\n", err)
					break
				}
				if msg == nil {
					break
				}

				if msg.ReasoningContent != "" {
					reasoningContent += msg.ReasoningContent
					response := &param.SSEChatResponse{
						Type:           "stream-reasoning",
						Content:        msg.ReasoningContent,
						ConversationId: conversationId,
					}
					responseChan <- response
				}
				if msg.Content != "" {
					content += msg.Content
					response := &param.SSEChatResponse{
						Type:           "stream-chat",
						Content:        msg.Content,
						ConversationId: conversationId,
					}
					responseChan <- response
				}
			}

			go func() {
				if reasoningContent != "" {
					agent.InsertMemory(s.ctx, conversationId, "stream-reasoning", reasoningContent)
				}
				if content != "" {
					agent.InsertMemory(s.ctx, conversationId, "stream-chat", content)
				}
			}()

			continue
		} else {
			var response *param.SSEChatResponse

			// 添加额外的nil检查，防止访问Message时出现panic
			if event.Output.MessageOutput.Message == nil {
				log.Printf("\n消息内容为空，跳过处理\n")
				continue
			}

			if event.Output.MessageOutput.Message.ToolName != "" {
				go agent.InsertMemoryWithTool(s.ctx, conversationId, string(event.Output.MessageOutput.Role), event.Output.MessageOutput.Message.Content, event.Output.MessageOutput.Message.ToolName)
				response = &param.SSEChatResponse{
					Type:           string(event.Output.MessageOutput.Role) + ":" + event.Output.MessageOutput.Message.ToolName,
					Content:        event.Output.MessageOutput.Message.Content,
					ConversationId: conversationId,
				}
				log.Printf("\n工具调用: %v\n", event.Output.MessageOutput.Message.ToolName)
			} else {
				go agent.InsertMemory(s.ctx, conversationId, string(event.Output.MessageOutput.Role), event.Output.MessageOutput.Message.Content)
				response = &param.SSEChatResponse{
					Type:           string(event.Output.MessageOutput.Role),
					Content:        event.Output.MessageOutput.Message.Content,
					ConversationId: conversationId,
				}
			}
			responseChan <- response
		}
	}

	return nil
}

func (s *ChatService) GetUploadUrl(request *param.UploadFileRequest) (*oss.PresignResult, error) {
	var ossRequest *param.GetUploadUrlRequest
	switch request.Type {
	case "image":
		ossRequest = &param.GetUploadUrlRequest{
			Bucket:      viper.GetString("oss.img-bucket"),
			Key:         request.FileName,
			ContentType: request.ContentType,
		}
	case "file":
		ossRequest = &param.GetUploadUrlRequest{
			Bucket:      viper.GetString("oss.file-bucket"),
			Key:         request.FileName,
			ContentType: request.ContentType,
		}
	default:
		return nil, errors.New("invalid upload type")
	}

	return util.GetUploadUrl(ossRequest, s.ctx)
}

// GenerateCourseOutline 生成课程大纲（结构化输出）
func (s *ChatService) GenerateCourseOutline(request *param.CourseOutlineRequest) (*param.CourseOutline, error) {
	runner := agent.DefaultCourseGeneratorRunner

	// 如果没有conversationId，创建新的
	conversationId := request.ConversationId
	if conversationId == "" {
		var err error
		conversationId, err = agent.CreateConversation(s.ctx, request.UserId)
		if err != nil {
			return nil, err
		}
		go func() {
			resp, err := config.DefaultArkModel.Generate(s.ctx, []*schema.Message{
				{
					Role:    schema.User,
					Content: fmt.Sprintf("下面是用户的消息，请直接输出一个总结性的标题：%s", request.Prompt),
				},
			})
			if err != nil {
				log.Printf("failed to generate title, err: %v", err)
				return
			}
			agent.UpdateConversationTitle(s.ctx, conversationId, resp.Content)
		}()
	}

	// 构造大纲生成提示词，要求JSON格式输出
	outlinePrompt := request.Prompt + `

请生成课程大纲，严格按照以下JSON格式输出，不要添加任何其他内容：

{
  "title": "课程标题",
  "introduction": "课程简介",
  "tags": "#标签1 #标签2 #标签3",
  "chapters": [
    {
      "index": 1,
      "title": "章节1标题",
      "content": ""
    },
    {
      "index": 2,
      "title": "章节2标题",
      "content": ""
    }
  ]
}

注意：
1. 只生成大纲，content字段留空
2. tags字段生成3-5个相关标签，格式为#标签名，用空格分隔，例如：#AI #机器学习 #深度学习
3. 直接输出JSON，不要使用markdown代码块`

	// 创建消息并存储
	message, err := agent.CreateUserMessageAndStore(s.ctx, conversationId, outlinePrompt, request.ImgUrls)
	if err != nil {
		return nil, err
	}

	// 执行生成（非流式）
	iterator := runner.Run(s.ctx, []adk.Message{message})

	outlineContent := ""
	for {
		event, ok := iterator.Next()
		if !ok {
			break
		}

		if event.Err != nil {
			log.Printf("大纲生成错误: %v", event.Err)
			return nil, event.Err
		}

		if event.Output != nil && event.Output.MessageOutput != nil && event.Output.MessageOutput.Message != nil {
			content := event.Output.MessageOutput.Message.Content
			if content != "" && event.Output.MessageOutput.Message.ToolName == "" {
				outlineContent += content
			}
		}
	}

	if outlineContent == "" {
		return nil, errors.New("大纲生成失败：内容为空")
	}

	// 存储助手回复
	go agent.InsertMemory(s.ctx, conversationId, "assistant", outlineContent)

	log.Printf("课程大纲原始输出:\n%s", outlineContent)

	// 清理并提取JSON
	jsonStr := s.extractJSON(outlineContent)
	if jsonStr == "" {
		return nil, errors.New("无法从输出中提取JSON")
	}

	// 解析JSON为结构化数据
	var outline param.CourseOutline
	if err := json.Unmarshal([]byte(jsonStr), &outline); err != nil {
		log.Printf("JSON解析失败: %v\nJSON内容: %s", err, jsonStr)
		return nil, errors.New("JSON解析失败: " + err.Error())
	}

	// 将conversationId添加到返回数据中
	outline.ConversationId = conversationId

	return &outline, nil
}

// GenerateCourseContent 根据大纲生成完整课程内容
func (s *ChatService) GenerateCourseContent(request *param.GenerateCourseRequest) (*param.CourseOutline, error) {
	outline := request.Outline
	conversationId := request.ConversationId

	// 如果请求中没有conversationId，尝试从outline中获取
	if conversationId == "" {
		conversationId = outline.ConversationId
	}

	if conversationId == "" {
		var err error
		conversationId, err = agent.CreateConversation(s.ctx, request.UserId)
		if err != nil {
			return nil, err
		}
		go func() {
			resp, err := config.DefaultArkModel.Generate(s.ctx, []*schema.Message{
				{
					Role:    schema.User,
					Content: fmt.Sprintf("下面是用户的消息，请直接输出一个总结性的标题：%s", outline.Title),
				},
			})
			if err != nil {
				log.Printf("failed to generate title, err: %v", err)
				return
			}
			agent.UpdateConversationTitle(s.ctx, conversationId, resp.Content)
		}()
	}

	// 逐章节生成内容
	for i := range outline.Chapters {
		log.Printf("开始生成章节 %d: %s", outline.Chapters[i].Index, outline.Chapters[i].Title)

		content, err := s.generateChapterContent(outline.Chapters[i].Title, conversationId, request.UserId)
		if err != nil {
			log.Printf("章节%d生成失败: %v", outline.Chapters[i].Index, err)
			continue
		}

		resp, err := config.DefaultArkModel.Generate(s.ctx, []*schema.Message{
			{
				Role:    schema.User,
				Content: fmt.Sprintf("下面是一个课程章节的内容，请直接输出一份50字以内的章节概述：%s", content),
			},
		})
		if err != nil {
			log.Printf("章节概述生成失败, err: %v", err)
		}

		outline.Chapters[i].Introduction = resp.Content
		outline.Chapters[i].Content = content
		log.Printf("章节 %d 生成完成，长度: %d", outline.Chapters[i].Index, len(content))
	}

	return &outline, nil
}

// generateChapterContent 生成单个章节的详细内容
func (s *ChatService) generateChapterContent(chapterTitle string, conversationId string, userId int64) (string, error) {
	runner := agent.DefaultCourseGeneratorRunner

	// 获取历史会话上下文（包含之前生成的大纲和章节内容）
	messages, _, err := agent.GetHistoryMessageList(s.ctx, conversationId, userId, "")
	if err != nil {
		log.Printf("获取历史消息失败: %v", err)
		return "", err
	}

	chapterPrompt := "请为以下章节生成详细内容：\n" + chapterTitle + "\n\n要求：1.内容详实、结构清晰、条理分明。2. 注意这是一个章节，不要拆分成多个章节。3. 请参考之前已生成的内容，保持风格和难度的连贯性，避免内容重复。 4. 直接输出课程内容，不需要提供结构化输出如json等"

	// 创建消息并存储
	message, err := agent.CreateUserMessageAndStore(s.ctx, conversationId, chapterPrompt, nil)
	if err != nil {
		return "", err
	}

	// 将新消息追加到历史消息中
	messages = append(messages, message)

	// 执行生成（使用包含历史上下文的完整消息列表）
	iterator := runner.Run(s.ctx, messages)

	chapterContent := ""
	for {
		event, ok := iterator.Next()
		if !ok {
			break
		}

		if event.Err != nil {
			log.Printf("章节内容生成错误: %v", event.Err)
			return "", event.Err
		}

		if event.Output != nil && event.Output.MessageOutput != nil && event.Output.MessageOutput.Message != nil {
			content := event.Output.MessageOutput.Message.Content
			if content != "" && event.Output.MessageOutput.Message.ToolName == "" {
				chapterContent += content
			}
		}
	}

	if chapterContent == "" {
		return "", errors.New("章节内容生成失败：内容为空")
	}

	// 存储助手回复
	go agent.InsertMemory(s.ctx, conversationId, "assistant", chapterContent)

	return chapterContent, nil
}

// extractJSON 从输出中提取JSON内容
func (s *ChatService) extractJSON(content string) string {
	// 去除markdown代码块标记
	content = trimSpace(content)

	// 移除可能的 ```json 或 ``` 标记
	if len(content) > 7 && content[:7] == "```json" {
		content = content[7:]
	} else if len(content) > 3 && content[:3] == "```" {
		content = content[3:]
	}

	if len(content) > 3 && content[len(content)-3:] == "```" {
		content = content[:len(content)-3]
	}

	content = trimSpace(content)

	// 查找第一个 { 和最后一个 }
	startIdx := -1
	endIdx := -1

	for i := 0; i < len(content); i++ {
		if content[i] == '{' {
			startIdx = i
			break
		}
	}

	for i := len(content) - 1; i >= 0; i-- {
		if content[i] == '}' {
			endIdx = i
			break
		}
	}

	if startIdx == -1 || endIdx == -1 || startIdx >= endIdx {
		return ""
	}

	return content[startIdx : endIdx+1]
}

// splitLines 分割字符串为行
func splitLines(s string) []string {
	var lines []string
	start := 0
	for i := 0; i < len(s); i++ {
		if s[i] == '\n' {
			lines = append(lines, s[start:i])
			start = i + 1
		}
	}
	if start < len(s) {
		lines = append(lines, s[start:])
	}
	return lines
}

// trimSpace 去除字符串首尾空白
func trimSpace(s string) string {
	start := 0
	end := len(s)

	for start < end && (s[start] == ' ' || s[start] == '\t' || s[start] == '\n' || s[start] == '\r') {
		start++
	}

	for end > start && (s[end-1] == ' ' || s[end-1] == '\t' || s[end-1] == '\n' || s[end-1] == '\r') {
		end--
	}

	return s[start:end]
}

// handleChatPanic 处理Chat函数中的panic恢复
func (s *ChatService) handleChatPanic(request *param.ChatRequest, responseChan chan *param.SSEChatResponse) {
	if r := recover(); r != nil {
		log.Printf("Chat函数发生panic，已恢复: %v", r)
		// 发送错误响应给客户端
		errorResponse := &param.SSEChatResponse{
			Type:           "error",
			Content:        "服务暂时不可用，请稍后重试",
			ConversationId: request.ConversationId,
		}
		select {
		case responseChan <- errorResponse:
		default:
			// 如果channel已关闭，忽略
		}
	}
}

// formatToolError 格式化工具调用错误信息，返回用户友好的错误消息
func (s *ChatService) formatToolError(err error) string {
	errMsg := err.Error()

	// 检查是否是JSON解析错误
	if errors.Is(err, errors.New("unexpected end of JSON input")) ||
		containsString(errMsg, "unexpected end of JSON input") {
		return "工具调用失败：服务响应不完整，可能是网络问题或工具服务暂时不可用，请稍后重试"
	}

	// 检查是否是MCP工具错误
	if containsString(errMsg, "failed to call mcp tool") {
		return "外部工具调用失败，请检查工具服务是否正常运行"
	}

	// 检查是否是超时错误
	if containsString(errMsg, "timeout") || containsString(errMsg, "deadline exceeded") {
		return "工具调用超时，请稍后重试或联系管理员"
	}

	// 检查是否是网络错误
	if containsString(errMsg, "connection refused") || containsString(errMsg, "network") {
		return "无法连接到工具服务，请检查网络连接"
	}

	// 默认返回通用错误信息
	return "工具调用出现错误，已记录日志，请稍后重试"
}

// isCriticalError 判断是否是需要中断处理的严重错误
func (s *ChatService) isCriticalError(err error) bool {
	if err == nil {
		return false
	}

	errMsg := err.Error()

	// 以下错误类型认为是可恢复的，不中断处理
	recoverableErrors := []string{
		"failed to call mcp tool",
		"unexpected end of JSON input",
		"timeout",
		"connection refused",
	}

	for _, recoverableErr := range recoverableErrors {
		if containsString(errMsg, recoverableErr) {
			return false // 不是严重错误，可以继续
		}
	}

	// 其他未知错误暂时也认为是可恢复的
	// 除非明确需要中断的错误类型
	return false
}

// containsString 辅助函数：检查字符串是否包含子串（不区分大小写）
func containsString(s, substr string) bool {
	return len(s) >= len(substr) &&
		(s == substr || len(substr) == 0 ||
			findSubstring(s, substr))
}

func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
