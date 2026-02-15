import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getCourseInfo } from '../../api/course';
import { getChaptersByCourseId, createChapterRecord, getChapterRecordByUserAndChapter } from '../../api/chapter';
import { getUserId } from '../../utils/authUtils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './CourseLearnPage.css';

// Mock Markdown 内容
const MOCK_MARKDOWN = `# 第一章：Python 基础入门

## 1.1 Python 简介

Python 是一种高级编程语言，具有简洁的语法和强大的功能。它被广泛应用于：

- Web 开发
- 数据分析
- 人工智能
- 自动化脚本

## 1.2 第一个 Python 程序

让我们从最经典的 "Hello, World!" 开始：

\`\`\`python
print("Hello, World!")
\`\`\`

这段代码会在控制台输出 "Hello, World!"。

## 1.3 变量和数据类型

Python 支持多种数据类型：

\`\`\`python
# 整数
age = 25

# 浮点数
price = 19.99

# 字符串
name = "Alice"

# 布尔值
is_student = True

# 列表
fruits = ["apple", "banana", "orange"]
\`\`\`

## 1.4 基本运算

Python 支持常见的数学运算：

\`\`\`python
# 算术运算
a = 10
b = 3

print(a + b)  # 13
print(a - b)  # 7
print(a * b)  # 30
print(a / b)  # 3.333...
print(a // b) # 3 (整除)
print(a % b)  # 1 (取余)
print(a ** b) # 1000 (幂运算)
\`\`\`

## 1.5 练习

尝试编写一个程序，计算两个数的和并输出结果。

> **提示**: 使用 \`input()\` 函数获取用户输入，使用 \`int()\` 转换为整数。

## 1.6 总结

本章我们学习了：

1. Python 的基本概念
2. 如何编写第一个程序
3. 变量和数据类型
4. 基本的数学运算

在下一章中，我们将学习条件语句和循环结构。
`;

const CourseLearnPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [markdownContent, setMarkdownContent] = useState(MOCK_MARKDOWN);
  const [loading, setLoading] = useState(true);
  const [leftWidth, setLeftWidth] = useState(50);
  const [isChapterCompleted, setIsChapterCompleted] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // 获取当前章节（需要在useEffect之前定义）
  const currentChapter = chapters[currentChapterIndex];

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const [courseData, chaptersData] = await Promise.all([
          getCourseInfo(courseId),
          getChaptersByCourseId(courseId),
        ]);
        setCourse(courseData);
        setChapters(chaptersData || []);
      } catch (error) {
        console.error('获取课程数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  // 获取markdown内容和章节完成状态
  useEffect(() => {
    const fetchChapterData = async () => {
      // 确保有课程ID和当前章节
      if (!courseId || !currentChapter || !currentChapter.id) {
        console.warn('缺少课程ID或章节ID，使用mock内容');
        setMarkdownContent(MOCK_MARKDOWN);
        setIsChapterCompleted(false);
        return;
      }

      // 获取markdown内容
      const markdownUrl = `https://course-chapter-cs.oss-cn-beijing.aliyuncs.com/${courseId}-${currentChapter.id}`;
      
      try {
        const response = await fetch(markdownUrl);
        if (response.ok) {
          const content = await response.text();
          setMarkdownContent(content);
          console.log(`成功从URL加载markdown内容: ${markdownUrl}`);
        } else {
          console.warn(`从URL获取markdown失败 (${response.status})，使用mock内容`);
          setMarkdownContent(MOCK_MARKDOWN);
        }
      } catch (error) {
        console.warn('获取markdown内容出错，使用mock内容:', error);
        setMarkdownContent(MOCK_MARKDOWN);
      }

      // 查询章节完成状态
      try {
        const record = await getChapterRecordByUserAndChapter(getUserId(), currentChapter.id);
        setIsChapterCompleted(record && record.completed === 1);
        console.log(`章节 ${currentChapter.id} 完成状态:`, record?.completed === 1);
      } catch (error) {
        console.warn('查询章节完成状态失败:', error);
        setIsChapterCompleted(false);
      }
    };

    fetchChapterData();
  }, [courseId, currentChapter]);

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const handleBackToCourse = () => {
    navigate(`/course/${courseId}`);
  };

  const handleCompleteChapter = async () => {
    if (!currentChapter?.id) {
      console.warn('没有当前章节信息');
      return;
    }

    try {
      // 调用API创建学习记录
      await createChapterRecord({
        userId: getUserId(),
        chapterId: currentChapter.id,
        completed: 1,
        endTime: Date.now(),
      });
      
      console.log('成功标记章节完成:', currentChapter.id);
      
      // 更新完成状态
      setIsChapterCompleted(true);
      
      // 完成后自动跳到下一章
      if (currentChapterIndex < chapters.length - 1) {
        handleNextChapter();
      } else {
        // 如果是最后一章，返回课程详情页
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      console.error('标记章节完成失败:', error);
      // 即使API调用失败，也允许用户继续操作
      if (currentChapterIndex < chapters.length - 1) {
        handleNextChapter();
      } else {
        navigate(`/course/${courseId}`);
      }
    }
  };

  const handleMouseDown = () => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (loading) {
    return (
      <div className="course-learn-page">
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-learn-page">
        <div className="loading-state">课程不存在</div>
      </div>
    );
  }

  return (
    <div className="course-learn-page" ref={containerRef}>
      <div className="learn-sidebar" style={{ width: `${leftWidth}%` }}>
        <div className="learn-header">
          <h1>{course.title}</h1>
          <div className="chapter-info">
            <span>
              章节 {currentChapterIndex + 1} / {chapters.length || 0}
            </span>
            {currentChapter && <span>{currentChapter.title}</span>}
          </div>
          <div className="chapter-nav">
            <button type="button" onClick={handleBackToCourse}>
              <FiChevronLeft />
              返回课程
            </button>
            <button
              type="button"
              onClick={handlePrevChapter}
              disabled={currentChapterIndex === 0}
            >
              <FiChevronLeft />
              上一章
            </button>
            <button
              type="button"
              onClick={handleNextChapter}
              disabled={currentChapterIndex >= chapters.length - 1}
            >
              下一章
              <FiChevronRight />
            </button>
            <button 
              type="button" 
              className={`complete-btn ${isChapterCompleted ? 'completed' : ''}`}
              onClick={handleCompleteChapter}
              disabled={isChapterCompleted}
            >
              {isChapterCompleted ? '已完成' : '完成学习'}
            </button>
          </div>
        </div>
        <div className="learn-content">
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div 
        className="resize-handle" 
        onMouseDown={handleMouseDown}
      />

      <div className="learn-editor" style={{ width: `${100 - leftWidth}%` }}>
        <div className="editor-container">
          <iframe src="http://localhost:38084/" title="Code Editor" />
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage;
