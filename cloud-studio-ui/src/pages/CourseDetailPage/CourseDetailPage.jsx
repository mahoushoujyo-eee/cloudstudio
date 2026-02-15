import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiShare2, FiMoreHorizontal, FiCheckCircle, FiEdit2, FiX, FiUploadCloud, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { getCourseInfo, updateCourse, setCourseCover, deleteCourse } from '../../api/course';
import { getChaptersByPagination, getChapterRecordsByUser } from '../../api/chapter';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getUserId } from '../../utils/authUtils';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import { getContentTypeByFileName, validateFileSize, isImageFile } from '../../utils/fileUtils';
import './CourseDetailPage.css';

const DEFAULT_COVER = 'https://cs-archive.codehub.cn/saas/app-resources/8/3/5/8353a96672d84eed88b21e0686bc2f7f.jpg';
const OSS_BASE_URL = 'https://course-cs.oss-cn-beijing.aliyuncs.com';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterPagination, setChapterPagination] = useState({
    current: 0,
    pageSize: 10,
    total: 0,
    pageCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER);
  const [completedChaptersCount, setCompletedChaptersCount] = useState(0);
  
  // 编辑模态框状态
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    tags: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);
  
  // 封面编辑状态
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [croppedCoverImage, setCroppedCoverImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  
  // 删除确认对话框状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const data = await getCourseInfo(courseId);
        setCourse(data);
        
        // 尝试加载 OSS 封面
        const ossUrl = `${OSS_BASE_URL}/${courseId}`;
        const img = new Image();
        img.onload = () => {
          setCoverImage(ossUrl);
        };
        img.onerror = () => {
          setCoverImage(DEFAULT_COVER);
        };
        img.src = ossUrl;
      } catch (error) {
        console.error('获取课程详情失败:', error);
        setCoverImage(DEFAULT_COVER);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetail();
  }, [courseId]);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!courseId) return;
      try {
        const result = await getChaptersByPagination(courseId, currentPage - 1, 10);
        setChapters(result.data || []);
        setChapterPagination({
          current: result.current || 0,
          pageSize: result.pageSize || 10,
          total: result.total || 0,
          pageCount: result.pageCount || 0
        });
      } catch (error) {
        console.error('获取章节列表失败:', error);
      }
    };
    fetchChapters();
  }, [courseId, currentPage]);

  // 查询用户课程完成记录
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isAuthenticated || !course) return;
      
      try {
        const records = await getChapterRecordsByUser(getUserId());
        if (records && Array.isArray(records)) {
          // 筛选出属于当前课程的已完成章节
          const courseChapterIds = new Set(chapters.map(ch => ch.id));
          const completedInThisCourse = records.filter(
            record => record.completed === 1 && courseChapterIds.has(record.chapterId)
          );
          setCompletedChaptersCount(completedInThisCourse.length);
        }
      } catch (error) {
        console.error('获取用户学习进度失败:', error);
        setCompletedChaptersCount(0);
      }
    };
    
    fetchUserProgress();
  }, [isAuthenticated, course, chapters]);

  const handleStart = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    navigate(`/course/${courseId}/learn`);
  };

  const handleOpenEdit = () => {
    if (!course) return;
    setEditForm({
      title: course.title || '',
      description: course.description || '',
      tags: course.tags || '',
    });
    setCroppedCoverImage(null);
    setCoverFile(null);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setUpdateStatus(null);
    setCroppedCoverImage(null);
    setCoverFile(null);
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // 处理封面图片选择
  const handleCoverSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isImageFile(file.name)) {
      setUpdateStatus({ variant: 'warning', message: '请选择图片文件' });
      return;
    }

    if (!validateFileSize(file, 5)) {
      setUpdateStatus({ variant: 'warning', message: '图片大小不能超过 5MB' });
      return;
    }

    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setNewCoverImage(reader.result);
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
      const croppedBlob = await createCroppedImage(newCoverImage, croppedAreaPixels);
      const croppedUrl = URL.createObjectURL(croppedBlob);
      setCroppedCoverImage(croppedUrl);
      
      const croppedFile = new File([croppedBlob], coverFile.name, { type: 'image/jpeg' });
      setCoverFile(croppedFile);
      
      setShowCropper(false);
      setUpdateStatus({ variant: 'success', message: '封面裁剪成功' });
    } catch (error) {
      console.error('裁剪图片失败:', error);
      setUpdateStatus({ variant: 'warning', message: '裁剪图片失败，请重试' });
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setNewCoverImage(null);
  };

  const handleRemoveCover = () => {
    setCroppedCoverImage(null);
    setCoverFile(null);
  };

  // 上传封面
  const uploadCoverImage = async (courseId) => {
    if (!coverFile) return null;

    try {
      const coverImageName = coverFile.name;
      const presignedUrl = await setCourseCover({
        id: courseId,
        coverImageName: coverImageName,
      });

      if (!presignedUrl || typeof presignedUrl !== 'string') {
        throw new Error('获取预签名 URL 失败');
      }

      const contentType = getContentTypeByFileName(coverFile.name);
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: coverFile,
        headers: {
          'Content-Type': contentType,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`上传图片失败: ${uploadResponse.status}`);
      }

      return coverImageName;
    } catch (error) {
      console.error('上传封面失败:', error);
      throw error;
    }
  };

  // 更新课程
  const handleUpdateCourse = async () => {
    if (!editForm.title.trim() || !editForm.description.trim()) {
      setUpdateStatus({ variant: 'warning', message: '请填写课程标题和简介' });
      return;
    }

    setIsUpdating(true);
    setUpdateStatus({ variant: 'info', message: '正在更新课程...' });

    try {
      // 1. 更新课程信息
      await updateCourse({
        id: courseId,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        tags: editForm.tags.trim(),
      });

      // 2. 如果有新封面，上传封面
      if (coverFile) {
        setUpdateStatus({ variant: 'info', message: '正在上传封面...' });
        await uploadCoverImage(courseId);
      }

      setUpdateStatus({ variant: 'success', message: '课程更新成功！' });
      
      // 延迟关闭并刷新页面
      setTimeout(() => {
        handleCloseEdit();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('更新课程失败:', error);
      setUpdateStatus({
        variant: 'warning',
        message: `更新失败: ${error.message || '请检查网络连接'}`,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // 打开删除确认对话框
  const handleOpenDeleteConfirm = () => {
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  // 删除课程
  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    try {
      await deleteCourse(courseId);
      // 删除成功，跳转到学习中心
      navigate('/learn', { replace: true });
    } catch (error) {
      console.error('删除课程失败:', error);
      alert(`删除失败: ${error.message || '请检查网络连接'}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return <div className="course-detail page-container">加载中...</div>;
  }

  if (!course) {
    return <div className="course-detail page-container">课程不存在</div>;
  }

  return (
    <div className="course-detail page-container">
      <div className="breadcrumb">
        <span>学习中心</span>
        <span> / </span>
        <span>{course.tags?.split(',')[0] || '其他'}</span>
        <span> / </span>
        <strong>{course.title}</strong>
      </div>
      <div className="detail-header">
        <img src={coverImage} alt={course.title} />
        <div className="detail-meta">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="stats">
            <span>{course.chapterCount || 0} 个章节</span>
            <span>0 名学习者</span>
          </div>
          <div className="detail-actions">
            <button type="button" className="ghost" onClick={handleOpenEdit}>
              <FiEdit2 />
              编辑课程
            </button>
            <button type="button" className="ghost">
              <FiShare2 />
              分享
            </button>
            <button type="button" className="ghost delete-btn" onClick={handleOpenDeleteConfirm}>
              <FiTrash2 />
              删除课程
            </button>
          </div>
        </div>
      </div>
      <div className="detail-body">
        <section className="chapters">
          <h2>课程章节</h2>
          {chapters.length === 0 ? (
            <p>暂无章节</p>
          ) : (
            chapters.map((chapter) => (
              <article key={chapter.id} className="chapter-card">
                <div>
                  <h4>{chapter.title}</h4>
                  <p>{chapter.description || '暂无描述'}</p>
                </div>
                <button type="button" onClick={handleStart}>
                  开始学习
                </button>
              </article>
            ))
          )}
          <div className="pager">
            <span>共 {course.chapterCount || 0} 个章节</span>
            <div className="pages">
              {Array.from({ length: chapterPagination.pageCount }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={currentPage === page ? 'active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <div className="jump">
              跳至
              <input
                type="number"
                min="1"
                max={chapterPagination.pageCount}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10);
                  if (page >= 1 && page <= chapterPagination.pageCount) {
                    setCurrentPage(page);
                  }
                }}
              />
              页
            </div>
          </div>
        </section>
        <aside className="course-sidebar">
          <div className="progress-card">
            <h4>课程进度</h4>
            <p>{isAuthenticated ? `已学习 ${completedChaptersCount}/${course.chapterCount || 0} 章节` : '登录后可查看进度'}</p>
            {isAuthenticated ? (
              <div className="progress-bar">
                <span style={{ width: `${course.chapterCount > 0 ? (completedChaptersCount / course.chapterCount * 100) : 0}%` }} />
              </div>
            ) : (
              <button type="button" onClick={openAuthModal}>
                登录查看
              </button>
            )}
          </div>
          <div className="recommend-card">
            <h4>推荐章节</h4>
            <ul>
              {chapters.slice(0, 3).map((ch) => (
                <li key={ch.id}>
                  <FiCheckCircle /> {ch.title.replace(/第.*章\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
          <div className="author-card">
            <h4>作者信息</h4>
            <p>Cloud Studio 官方教研团队</p>
            <small>聚焦 AI 课程研发与行业实践。</small>
          </div>
        </aside>
      </div>

      {/* 编辑课程模态框 */}
      {showEditModal && (
        <div className="edit-modal">
          <div className="edit-modal-overlay" onClick={handleCloseEdit}></div>
          <div className="edit-modal-content">
            <div className="edit-modal-header">
              <h3>编辑课程</h3>
              <button type="button" className="close-btn" onClick={handleCloseEdit}>
                <FiX />
              </button>
            </div>
            
            {updateStatus && (
              <div className={`update-status ${updateStatus.variant}`}>
                {updateStatus.message}
              </div>
            )}

            <div className="edit-modal-body">
              <div className="form-row">
                <label>课程名称</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="例如：AI Agent 实战营"
                />
              </div>

              <div className="form-row">
                <label>课程简介</label>
                <textarea
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="补充课程亮点、目标人群以及可掌握的能力"
                />
              </div>

              <div className="form-row">
                <label>话题标签</label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => handleFormChange('tags', e.target.value)}
                  placeholder="#AI #Agent #产品化"
                />
                <small>使用逗号分隔标签。</small>
              </div>

              <div className="form-row">
                <label>课程封面</label>
                <div className="cover-upload-area">
                  {croppedCoverImage ? (
                    <div className="cover-preview-edit">
                      <img src={croppedCoverImage} alt="封面预览" />
                      <button type="button" className="remove-cover-btn" onClick={handleRemoveCover}>
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <div className="cover-upload-placeholder">
                      <FiUploadCloud />
                      <p>点击选择新封面（16:9，最大 5MB）</p>
                      <label htmlFor="edit-cover-upload" className="upload-label">
                        选择文件
                      </label>
                      <input
                        id="edit-cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden-file-input"
                        onChange={handleCoverSelect}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="edit-modal-footer">
              <button type="button" className="secondary-btn" onClick={handleCloseEdit}>
                取消
              </button>
              <button 
                type="button" 
                className="primary-btn" 
                onClick={handleUpdateCourse}
                disabled={isUpdating}
              >
                {isUpdating ? '更新中...' : '保存更新'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图片裁剪器 */}
      {showCropper && newCoverImage && (
        <ImageCropper
          image={newCoverImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-overlay" onClick={handleCloseDeleteConfirm}></div>
          <div className="delete-confirm-content">
            <div className="delete-confirm-icon">
              <FiAlertTriangle />
            </div>
            <h3>确认删除课程？</h3>
            <p>此操作将永久删除课程「{course?.title}」及其所有章节，且无法恢复。</p>
            <div className="delete-confirm-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCloseDeleteConfirm}
                disabled={isDeleting}
              >
                取消
              </button>
              <button 
                type="button" 
                className="delete-btn" 
                onClick={handleDeleteCourse}
                disabled={isDeleting}
              >
                {isDeleting ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
