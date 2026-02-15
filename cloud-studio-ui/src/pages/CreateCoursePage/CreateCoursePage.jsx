import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiEye,
  FiEyeOff,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUpload,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createCourse, setCourseCover } from '../../api/course';
import { batchCreateChapters, batchSetChapterMarkdown } from '../../api/chapter';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import { getContentTypeByFileName, validateFileSize, isImageFile } from '../../utils/fileUtils';
import './CreateCoursePage.css';

const buildChapter = (index) => ({
  id: Date.now() + index,
  title: '',
  description: '',
  markdown: '',
  collapsed: true, // 默认收起
  uploadedFileName: '',
  editorKey: Date.now(), // 用于强制编辑器重新渲染
  initialized: false, // 标记编辑器是否已初始化
});

const ChapterMarkdownEditor = ({ value, onChange, editorKey }) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);

  // 同步外部value变化
  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setContent(newValue);
    onChange(newValue);
  };

  return (
    <div className="simple-markdown-editor">
      <div className="editor-toolbar">
        {!isPreview && (
          <>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end);
              const newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }}>
              <strong>B</strong>
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end);
              const newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }}>
              <em>I</em>
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const lines = content.substring(0, start).split('\n');
              const currentLine = lines[lines.length - 1];
              if (!currentLine.startsWith('# ')) {
                const newText = content.substring(0, start - currentLine.length) + '# ' + currentLine + content.substring(start);
                setContent(newText);
                onChange(newText);
              }
            }}>
              H1
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const lines = content.substring(0, start).split('\n');
              const currentLine = lines[lines.length - 1];
              if (!currentLine.startsWith('## ')) {
                const newText = content.substring(0, start - currentLine.length) + '## ' + currentLine + content.substring(start);
                setContent(newText);
                onChange(newText);
              }
            }}>
              H2
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const lines = content.substring(0, start).split('\n');
              const currentLine = lines[lines.length - 1];
              if (!currentLine.startsWith('### ')) {
                const newText = content.substring(0, start - currentLine.length) + '### ' + currentLine + content.substring(start);
                setContent(newText);
                onChange(newText);
              }
            }}>
              H3
            </button>
            <div className="toolbar-divider" />
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end);
              const newText = content.substring(0, start) + `~~${selectedText}~~` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="删除线">
              <del>S</del>
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end);
              const newText = content.substring(0, start) + `\`${selectedText}\`` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="行内代码">
              {'</>'}
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end) || 'code';
              const newText = content.substring(0, start) + `\`\`\`\n${selectedText}\n\`\`\`` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="代码块">
              {'{ }'}
            </button>
            <div className="toolbar-divider" />
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const lines = content.substring(0, start).split('\n');
              const currentLine = lines[lines.length - 1];
              if (!currentLine.startsWith('- ')) {
                const newText = content.substring(0, start - currentLine.length) + '- ' + currentLine + content.substring(start);
                setContent(newText);
                onChange(newText);
              }
            }} title="无序列表">
              ≡
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const lines = content.substring(0, start).split('\n');
              const currentLine = lines[lines.length - 1];
              if (!currentLine.match(/^\d+\. /)) {
                const newText = content.substring(0, start - currentLine.length) + '1. ' + currentLine + content.substring(start);
                setContent(newText);
                onChange(newText);
              }
            }} title="有序列表">
              1.
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end) || '引用内容';
              const newText = content.substring(0, start) + `> ${selectedText}` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="引用">
              "
            </button>
            <div className="toolbar-divider" />
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end) || '描述';
              const newText = content.substring(0, start) + `[${selectedText}](url)` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="链接">
              🔗
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;
              const selectedText = content.substring(start, end) || '图片描述';
              const newText = content.substring(0, start) + `![${selectedText}](url)` + content.substring(end);
              setContent(newText);
              onChange(newText);
            }} title="图片">
              🖼️
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const table = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n';
              const newText = content.substring(0, start) + table + content.substring(start);
              setContent(newText);
              onChange(newText);
            }} title="表格">
              ⊞
            </button>
            <button type="button" onClick={() => {
              const textarea = editorRef.current;
              const start = textarea.selectionStart;
              const newText = content.substring(0, start) + '\n---\n' + content.substring(start);
              setContent(newText);
              onChange(newText);
            }} title="分隔线">
              ―
            </button>
            <div className="toolbar-divider" />
          </>
        )}
        <button 
          type="button" 
          className="preview-toggle-btn"
          onClick={() => setIsPreview(!isPreview)}
        >
          {isPreview ? (
            <>
              <FiEyeOff /> 编辑
            </>
          ) : (
            <>
              <FiEye /> 预览
            </>
          )}
        </button>
      </div>
      {isPreview ? (
        <div className="markdown-preview">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*暂无内容*'}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={editorRef}
          key={editorKey}
          className="markdown-textarea"
          value={content}
          onChange={handleChange}
          placeholder="使用 Markdown 语法撰写章节内容...&#10;&#10;支持的语法：&#10;# 标题&#10;**粗体** *斜体*&#10;- 列表项&#10;[链接](url)&#10;```代码块```"
        />
      )}
    </div>
  );
};

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [courseInfo, setCourseInfo] = useState({
    title: '',
    description: '',
    tags: '#AI #Agent',
    visibility: 'private',
  });
  const [chapters, setChapters] = useState([buildChapter(0)]);
  const [autoResources, setAutoResources] = useState({
    outline: true,
    exercises: true,
    certificate: false,
  });
  const [status, setStatus] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  // 图片相关状态
  const [coverImage, setCoverImage] = useState(null); // 原始图片
  const [croppedImage, setCroppedImage] = useState(null); // 裁剪后的图片
  const [showCropper, setShowCropper] = useState(false); // 是否显示裁剪器
  const [imageFile, setImageFile] = useState(null); // 图片文件对象

  const publishReady = useMemo(() => {
    if (!courseInfo.title.trim() || !courseInfo.description.trim()) {
      return false;
    }
    return chapters.every((chapter) => chapter.title.trim());
  }, [courseInfo.title, courseInfo.description, chapters]);

  const handleInfoChange = (field) => (event) => {
    const { value } = event.target;
    setCourseInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleChapterChange = (chapterId, field, value) => {
    setChapters((prev) =>
      prev.map((chapter) => (chapter.id === chapterId ? { ...chapter, [field]: value } : chapter)),
    );
  };

  const addChapter = () => {
    setChapters((prev) => [...prev, buildChapter(prev.length + 1)]);
  };

  const removeChapter = (chapterId) => {
    setChapters((prev) => (prev.length === 1 ? prev : prev.filter((chapter) => chapter.id !== chapterId)));
  };

  const toggleChapterCollapse = (chapterId) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter,
      ),
    );
  };

  const handleMarkdownUpload = (chapterId, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result?.toString() || '';
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, markdown: text, uploadedFileName: file.name, collapsed: false, editorKey: Date.now(), initialized: true }
            : chapter,
        ),
      );
      setStatus({
        variant: 'info',
        message: `${file.name} 已成功导入为 Markdown 内容。`,
      });
    };
    reader.readAsText(file);
  };

  const handleStartFromEmpty = (chapterId) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, markdown: '', collapsed: false, editorKey: Date.now(), initialized: true }
          : chapter,
      ),
    );
  };

  const toggleResource = (field) => {
    setAutoResources((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // 处理图片选择
  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    if (!isImageFile(file.name)) {
      setStatus({
        variant: 'warning',
        message: '请选择图片文件',
      });
      return;
    }

    // 验证文件大小 (5MB)
    if (!validateFileSize(file, 5)) {
      setStatus({
        variant: 'warning',
        message: '图片大小不能超过 5MB',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // 创建裁剪后的图片
  const createCroppedImage = async (imageSrc, croppedAreaPixels) => {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        
        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.9);
      };
    });
  };

  // 处理裁剪完成
  const handleCropComplete = async (croppedAreaPixels) => {
    try {
      const croppedBlob = await createCroppedImage(coverImage, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedImage(croppedUrl);
      
      // 创建新的 File 对象用于上传
      const croppedFile = new File(
        [croppedBlob], 
        imageFile.name, 
        { type: 'image/jpeg' }
      );
      setImageFile(croppedFile);
      
      setShowCropper(false);
      setStatus({
        variant: 'success',
        message: '封面图片裁剪成功',
      });
    } catch (error) {
      console.error('裁剪图片失败:', error);
      setStatus({
        variant: 'warning',
        message: '裁剪图片失败，请重试',
      });
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setShowCropper(false);
    setCoverImage(null);
  };

  // 移除封面图片
  const handleRemoveCover = () => {
    setCoverImage(null);
    setCroppedImage(null);
    setImageFile(null);
  };

  // 上传封面图片到服务器
  const uploadCoverImage = async (courseId) => {
    if (!imageFile) return null;

    try {
      // 1. 获取预签名 URL
      const coverImageName = imageFile.name;
      const presignedUrl = await setCourseCover({
        id: courseId,
        coverImageName: coverImageName,
      });

      if (!presignedUrl || typeof presignedUrl !== 'string') {
        throw new Error('获取预签名 URL 失败');
      }

      // 2. 使用预签名 URL 直接上传图片到 OSS
      const contentType = getContentTypeByFileName(imageFile.name);
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: imageFile,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`上传图片失败: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      console.log('封面图片上传成功:', coverImageName);
      return coverImageName;
    } catch (error) {
      console.error('上传封面图片失败:', error);
      throw error;
    }
  };

  const handleSaveDraft = (event) => {
    event.preventDefault();
    setStatus({
      variant: 'info',
      message: '课程草稿已保存，可在学习中心的「课程草稿」列表继续完善。',
    });
  };

  const handlePublish = async () => {
    if (!publishReady) {
      setStatus({
        variant: 'warning',
        message: '发布前请补充课程标题、简介并为每个模块填写名称。',
      });
      return;
    }

    // 检查每个章节是否都有内容
    const emptyChapters = chapters.filter(
      (chapter) => !chapter.markdown || chapter.markdown.trim() === ''
    );

    if (emptyChapters.length > 0) {
      const emptyTitles = emptyChapters
        .map((ch) => `"${ch.title}"`)
        .join('、');
      setStatus({
        variant: 'warning',
        message: `以下章节缺少内容：${emptyTitles}。请在 Markdown 编辑器中填写内容或上传 .md 文件。`,
      });
      return;
    }

    setIsPublishing(true);
    setStatus({
      variant: 'info',
      message: '正在创建课程...',
    });

    try {
      // 1. 创建课程
      const courseData = {
        title: courseInfo.title.trim(),
        description: courseInfo.description.trim(),
        tags: courseInfo.tags.replace(/\s+/g, ',').replace(/^,|,$/g, ''),
        chapterCount: chapters.length,
      };

      const createdCourse = await createCourse(courseData);
      
      if (!createdCourse) {
        throw new Error('课程创建失败,未返回课程信息');
      }

      const courseId = createdCourse.id || createdCourse;

      // 2. 上传封面图片
      if (imageFile) {
        setStatus({
          variant: 'info',
          message: '正在上传封面图片...',
        });
        try {
          await uploadCoverImage(courseId);
        } catch (error) {
          console.error('上传封面失败:', error);
          // 不阻断流程，继续创建章节
        }
      }

      // 3. 批量创建章节
      if (chapters.length > 0) {
        setStatus({
          variant: 'info',
          message: '正在创建章节...',
        });

        const chapterData = {
          courseId: courseId,
          chapters: chapters.map((chapter, index) => ({
            title: chapter.title.trim(),
            description: chapter.description.trim() || chapter.markdown.substring(0, 50),
            orderIndex: index + 1,
          })),
        };

        console.log('准备批量创建章节，数据:', chapterData);
        const createResult = await batchCreateChapters(chapterData);
        console.log('批量创建章节返回结果:', createResult);
        
        // 4. 批量上传章节 markdown 文件到 OSS
        // createResult 直接是数组，不需要 .data
        if (createResult && Array.isArray(createResult) && createResult.length > 0) {
          console.log('章节 ID 列表:', createResult);
          setStatus({
            variant: 'info',
            message: '正在上传章节内容到云端...',
          });

          try {
            // 准备批量获取预签名 URL 的数据
            const markdownParams = {
              courseId: courseId,
              chapters: createResult.map((chapterId, index) => ({
                id: chapterId,
                markdownFileName: `chapter_${chapterId}.md`,
              })),
            };

            console.log('准备获取预签名 URL，参数:', markdownParams);
            // 调用 batch-markdown 接口获取所有预签名 URL
            const presignedUrls = await batchSetChapterMarkdown(markdownParams);
            console.log('获取到的预签名 URL:', presignedUrls);

            // 使用预签名 URL 上传每个章节的 markdown 内容
            if (presignedUrls && Array.isArray(presignedUrls)) {
              const uploadPromises = presignedUrls.map(async (presignedUrl, index) => {
                const chapter = chapters[index];
                const markdownBlob = new Blob([chapter.markdown], { type: 'text/markdown; charset=utf-8' });
                
                console.log(`开始上传章节 ${createResult[index]} 的 markdown`);
                const uploadResponse = await fetch(presignedUrl, {
                  method: 'PUT',
                  body: markdownBlob,
                  headers: {
                    'Content-Type': 'text/markdown',
                  },
                });

                if (!uploadResponse.ok) {
                  console.error(`上传章节 ${createResult[index]} 的 markdown 失败:`, uploadResponse.status);
                } else {
                  console.log(`章节 ${createResult[index]} 的 markdown 上传成功`);
                }
              });

              await Promise.all(uploadPromises);
              console.log('所有章节 markdown 上传完成');
            }
          } catch (error) {
            console.error('上传章节 markdown 失败:', error);
            // 不阻断流程
          }
        }
      }

      setCourseInfo((prev) => ({ ...prev, visibility: 'public' }));
      setStatus({
        variant: 'success',
        message: '课程已成功发布!即将跳转到课程详情页...',
      });

      // 跳转到课程详情页
      setTimeout(() => {
        navigate(`/course/${courseId}`);
      }, 2000);

    } catch (error) {
      console.error('发布课程失败:', error);
      setStatus({
        variant: 'warning',
        message: `发布失败: ${error.message || '请检查网络连接或稍后重试'}`,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    setStatus({
      variant: 'neutral',
      message: '预览链接将在首次发布后生成，现在将展示最新草稿内容。',
    });
  };

  return (
    <div className="create-course-page page-container">
      <header className="creation-header">
        <div>
          <p className="eyebrow">创建课程</p>
          <h1>构建一门全新的学习体验</h1>
          <p className="subtitle">完善课程信息、搭建章节结构并开启发布，Cloud Studio 将自动生成学习空间。</p>
        </div>
        <div className="creation-actions">
          <button type="button" className="ghost-btn" onClick={handlePreview}>
            <FiEye />
            预览页面
          </button>
          <button type="button" className="secondary-btn" onClick={handleSaveDraft}>
            <FiSave />
            保存草稿
          </button>
          <button type="button" className="primary-btn" onClick={handlePublish} disabled={!publishReady || isPublishing}>
            <FiCheckCircle />
            {isPublishing ? '发布中...' : '发布课程'}
          </button>
        </div>
      </header>

      {status && (
        <div className={`status-toast ${status.variant || 'neutral'}`}>
          <span>{status.message}</span>
        </div>
      )}

      <div className="creation-grid">
        <form className="creation-form" onSubmit={handleSaveDraft}>
          <section className="form-section">
            <h2>课程基础信息</h2>
            <div className="form-row">
              <label htmlFor="course-title">课程名称</label>
              <input
                id="course-title"
                type="text"
                placeholder="例如：AI Agent 实战营"
                value={courseInfo.title}
                onChange={handleInfoChange('title')}
              />
            </div>
            <div className="form-row">
              <label htmlFor="course-description">课程简介</label>
              <textarea
                id="course-description"
                placeholder="补充课程亮点、目标人群以及可掌握的能力"
                rows={4}
                value={courseInfo.description}
                onChange={handleInfoChange('description')}
              />
            </div>
            <div className="form-row">
              <label htmlFor="course-tags">话题标签</label>
              <input
                id="course-tags"
                type="text"
                value={courseInfo.tags}
                placeholder="#AI #Agent #产品化"
                onChange={handleInfoChange('tags')}
              />
              <small>使用空格分隔标签，将用于检索与推荐。</small>
            </div>
            <div className="upload-card">
              {croppedImage ? (
                <div className="cover-preview">
                  <img src={croppedImage} alt="课程封面预览" />
                  <button 
                    type="button" 
                    className="remove-cover-btn"
                    onClick={handleRemoveCover}
                    aria-label="移除封面"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  <FiUploadCloud />
                  <div>
                    <strong>上传封面</strong>
                    <p>建议尺寸 1280 × 720 (16:9)，支持 JPG、PNG 格式，最大 5MB</p>
                  </div>
                  <label htmlFor="cover-upload" className="ghost-btn">
                    选择文件
                  </label>
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden-file-input"
                    onChange={handleImageSelect}
                  />
                </>
              )}
            </div>
          </section>

          <section className="form-section">
            <div className="section-title">
              <div>
                <h2>课程章节</h2>
                <p>规划模块、知识点及实践内容，建议每个章节配备可交付任务。</p>
              </div>
              <button type="button" className="text-btn" onClick={addChapter}>
                <FiPlus />
                添加章节
              </button>
            </div>
            <div className="chapter-list">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="chapter-item">
                  {(() => {
                    const uploadInputId = `chapter-md-upload-${chapter.id}`;
                    return (
                      <>
                        <div className="chapter-head">
                          <strong>模块 {index + 1}</strong>
                          <div className="chapter-head-actions">
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => removeChapter(chapter.id)}
                              disabled={chapters.length === 1}
                              aria-label="删除章节"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                        <div className="form-row">
                          <label>章节标题</label>
                          <input
                            type="text"
                            value={chapter.title}
                            placeholder="例如：从 0 到 1 的 Agent 系统设计"
                            onChange={(event) => handleChapterChange(chapter.id, 'title', event.target.value)}
                          />
                        </div>
                        <div className="form-row">
                          <label>章节简介</label>
                          <textarea
                            rows={3}
                            value={chapter.description}
                            placeholder="概述章节的目标、覆盖知识点以及预期产出。"
                            onChange={(event) => handleChapterChange(chapter.id, 'description', event.target.value)}
                          />
                        </div>
                        <div className="markdown-section">
                          <div className="markdown-section-header">
                            <label>Markdown 课程内容</label>
                            {chapter.initialized && (
                              <div className="markdown-section-actions">
                                {chapter.uploadedFileName && (
                                  <span className="uploaded-file-name">已导入：{chapter.uploadedFileName}</span>
                                )}
                                <button
                                  type="button"
                                  className="ghost-btn markdown-collapse-btn mobile-toggle"
                                  onClick={() => toggleChapterCollapse(chapter.id)}
                                  aria-expanded={!chapter.collapsed}
                                >
                                  {chapter.collapsed ? (
                                    <>
                                      <FiChevronDown /> 展开编辑器
                                    </>
                                  ) : (
                                    <>
                                      <FiChevronUp /> 收起编辑器
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                          
                          {!chapter.initialized ? (
                            <div className="markdown-init-options">
                              <p>选择如何开始编辑课程内容：</p>
                              <div className="init-buttons">
                                <button
                                  type="button"
                                  className="secondary-btn"
                                  onClick={() => handleStartFromEmpty(chapter.id)}
                                >
                                  <FiPlus />
                                  从空内容开始编辑
                                </button>
                                <label htmlFor={uploadInputId} className="secondary-btn">
                                  <FiUpload />
                                  导入 Markdown 文件
                                </label>
                                <input
                                  id={uploadInputId}
                                  type="file"
                                  accept=".md,.markdown,.txt"
                                  className="hidden-file-input"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    handleMarkdownUpload(chapter.id, file);
                                    event.target.value = '';
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            !chapter.collapsed && (
                              <div className="chapter-markdown-editor">
                                <ChapterMarkdownEditor
                                  key={chapter.id}
                                  editorKey={chapter.editorKey}
                                  value={chapter.markdown}
                                  onChange={(value) => handleChapterChange(chapter.id, 'markdown', value)}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ))}
            </div>
          </section>

          <section className="form-section">
            <h2>自动化配置</h2>
            <div className="toggle-list">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={autoResources.outline}
                  onChange={() => toggleResource('outline')}
                />
                <div>
                  <strong>自动生成课程大纲</strong>
                  <p>根据章节内容生成海报级课程大纲，便于宣传。</p>
                </div>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={autoResources.exercises}
                  onChange={() => toggleResource('exercises')}
                />
                <div>
                  <strong>同步练习与测验</strong>
                  <p>为每章节创建练习题与测验，支持自动批改。</p>
                </div>
              </label>
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={autoResources.certificate}
                  onChange={() => toggleResource('certificate')}
                />
                <div>
                  <strong>授予结课证书</strong>
                  <p>完成全部任务后自动颁发可分享的数字证书。</p>
                </div>
              </label>
            </div>
          </section>
        </form>

        <aside className="creation-preview">
          <div className="preview-card">
            <div className="preview-cover" style={croppedImage ? { backgroundImage: `url(${croppedImage})` } : {}}>
              <span>{chapters.length ? `章节 ${chapters.length}` : '未添加章节'}</span>
              <p>{courseInfo.visibility === 'public' ? '已发布' : '草稿'}</p>
            </div>
            <div className="preview-content">
              <h3>{courseInfo.title || '未命名课程'}</h3>
              <p>{courseInfo.description || '补充课程简介后，系统将在此展示主卖点。'}</p>
              <div className="preview-meta">
                <span>当前章节：{chapters.length}</span>
                <span>公开状态：{courseInfo.visibility === 'public' ? '公开' : '仅自己可见'}</span>
              </div>
              <div className="preview-tags">
                {courseInfo.tags
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
              </div>
            </div>
          </div>

          <div className="publish-panel">
            <h4>发布状态</h4>
            <ul>
              <li>
                <strong>可见性</strong>
                <span>{courseInfo.visibility === 'public' ? '已发布' : '草稿'}</span>
              </li>
              <li>
                <strong>章节数</strong>
                <span>{chapters.length} 个模块</span>
              </li>
              <li>
                <strong>自动化工具</strong>
                <span>
                  {Object.values(autoResources).filter(Boolean).length} / {Object.keys(autoResources).length}
                </span>
              </li>
            </ul>
            <div className="publish-actions">
              <button type="button" className="secondary-btn" onClick={handleSaveDraft}>
                保存草稿
              </button>
              <button type="button" className="primary-btn" onClick={handlePublish} disabled={!publishReady || isPublishing}>
                {isPublishing ? '发布中...' : '发布课程'}
              </button>
            </div>
          </div>
        </aside>
      </div>

      {showCropper && coverImage && (
        <ImageCropper
          image={coverImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
};

export default CreateCoursePage;
