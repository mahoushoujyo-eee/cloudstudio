package param

type ChatRequest struct {
	Prompt         string   `json:"prompt"`
	ImgUrls        []string `json:"img_urls"`
	UserId         int64    `json:"user_id"`
	ConversationId string   `json:"conversation_id"`
	Agent          string   `json:"agent"`
}

type UploadFileRequest struct {
	Type        string `json:"type"`
	FileName    string `json:"file_name"`
	Size        int64  `json:"size"`
	ContentType string `json:"content_type"`
}

type SSEChatResponse struct {
	Type           string `json:"type"`
	Content        string `json:"content"`
	ConversationId string `json:"conversation_id"`
}

// CourseOutline 课程大纲结构
type CourseOutline struct {
	Title          string        `json:"title"`           // 课程标题
	Introduction   string        `json:"introduction"`    // 课程简介
	Tags           string        `json:"tags"`            // 标签，格式：#标签1 #标签2
	Chapters       []ChapterInfo `json:"chapters"`        // 章节列表
	ConversationId string        `json:"conversation_id"` // 会话ID（用于后续生成内容）
}

// ChapterInfo 章节信息
type ChapterInfo struct {
	Index        int    `json:"index"`        // 章节序号
	Introduction string `json:"introduction"` // 章节简介
	Title        string `json:"title"`        // 章节标题
	Content      string `json:"content"`      // 章节详细内容（生成完整课程时填充）
}

// CourseOutlineRequest 生成课程大纲请求
type CourseOutlineRequest struct {
	Prompt         string   `json:"prompt"`          // 课程主题/需求描述
	ImgUrls        []string `json:"img_urls"`        // 可选的参考图片
	ConversationId string   `json:"conversation_id"` // 会话ID（可选）
	UserId         int64    `json:"user_id"`         // 用户ID
}

// GenerateCourseRequest 生成完整课程请求
type GenerateCourseRequest struct {
	Outline        CourseOutline `json:"outline"`         // 课程大纲
	ConversationId string        `json:"conversation_id"` // 会话ID
	UserId         int64         `json:"user_id"`         // 用户ID
}
